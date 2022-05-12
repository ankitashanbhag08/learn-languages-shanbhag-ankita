require('dotenv').config()
const mysql = require('mysql');
const { NULL } = require('mysql/lib/protocol/constants/types');

var connection = mysql.createConnection({ 
 connectionLimit : 10,         //connection pool
 host: process.env.DB_HOST,
 user: process.env.DB_USER,
 password: process.env.DB_PASSWORD,
 database: process.env.DB_DB,
 multipleStatements: false      //prevents SQL injection
});

//Takes sql statement and parameters and executes the query.
const execQuery = (query, params) => {
    return new Promise((resolve, reject) =>{
        connection.query(query, params, (err, result) => {
            if (err)
                return reject(err);
            resolve(result);
        });
    });
}

//Object Literals
function getTableName(type) {
  var table = {
    'English': 'eng_word_master',
    'Finnish': 'fin_word_master',
    'German' : 'german_word_master',
  };
  return table[type]
}

function getId(type) {
  var id = {
    'English': 'eng_id',
    'Finnish': 'fin_id',
    'German' : 'german_id'
  };
  return id[type]
}

let connectionFunctions = {
    connect:(callback)=>{
        connection.connect((err)=>{
            callback();
        });
    },    
    //Returns all the categories
    findTags:()=>{
        let sql='SELECT * FROM category_master'
        console.log(sql)
        return new Promise((resolve, reject)=>{
                connection.query(sql, (err, results)=>{
                err ? reject(err) : resolve(results)
            })
        })
        
    },
    saveTag:(newTag)=>{
        let sql = "INSERT INTO category_master (name) VALUES (?) "
        return new Promise((resolve, reject)=>{
            connection.query(sql, [newTag], (err, results)=>{
                err ? reject(err) : resolve(results.insertId)
            })
        })
    },
    //Returns records of english words, finnish translated words, categories and corresponding ids.
    findAll: () =>{
        let sql = "SELECT eng_word_master.id as eng_id,eng_word_master.word as eng_word,fin_word_master.id AS fin_id,fin_word_master.word as fin_word, german_word_master.word as german_word, category_master.name, category_master.id as cat_id FROM eng_word_master" + 
                    " JOIN word_meaning ON eng_word_master.id = word_meaning.eng_id"+
                    " JOIN fin_word_master ON fin_word_master.id = word_meaning.fin_id"+
                    " JOIN german_word_master ON german_word_master.id = word_meaning.german_id"+
                    " LEFT OUTER JOIN category_master ON eng_word_master.category_id = category_master.id;"  
        console.log(sql)      
        return new Promise((resolve, reject)=>{
                connection.query(sql, (err, results)=>{
                err ? reject(err) : resolve(results)
            })
        })
        
    },

    /*Saves new word and its meaning and category into database. This is a transaction - even if 1 query fails to
    execute, rollback will happen.*/
    save:async (newWord)=>{
            let category=null;
            //If category is not given the insert NULL into category id.
            category = (newWord.category==="") ? category : newWord.category;
            const sql1 = "INSERT INTO eng_word_master (word, category_id) VALUES (?, ?)"
            const sql2 = "INSERT INTO fin_word_master (word, category_id) VALUES (?, ?)"
            const sql3 = "INSERT INTO german_word_master (word, category_id) VALUES (?, ?)"
            const sql4 = "INSERT INTO word_meaning (eng_id, fin_id, german_id) VALUES (?, ?, ?);"
            try{
                await connection.beginTransaction();
                let result1 = await execQuery(sql1, [newWord.engWord, category])     
                let result2 = await execQuery(sql2, [newWord.finWord, category])
                let result3 = await execQuery(sql3, [newWord.germanWord, category])
                //inserts foreign keys(eng_id and fin_id) from above 2 queries
                let result4 = await execQuery(sql4, [result1.insertId, result2.insertId, result3.insertId])                
                await connection.commit();
                return({engId:result1.insertId, finId:result2.insertId, germanId:result3.insertId})
            }catch(err){
                await connection.rollback();
                console.log(err)
                return("error!")                
            }   
    },
    /*Updates record in database. This is a transaction - even if 1 query fails to
    execute, rollback will happen.*/
    update: async(word)=>{
         console.log(word)
         let category=null;
         //If category is not given the insert category id id set tu NULL.
            category = (word.category==="") ? category : Number(word.category);
         let finId = Number(word.engId)
         let engId=Number(word.engId)
          
        let recordsUpdated = false
        let sql1 = `UPDATE eng_word_master SET word = ?, category_id = ? WHERE id = ?`
        let sql2 = `UPDATE fin_word_master SET word = ?, category_id = ? WHERE id = ?`
        try{
                await connection.beginTransaction();
                console.log(word)
                await execQuery(sql1, [word.engWord, category, engId])     
                
                await execQuery(sql2, [word.finWord, category, finId])
                await connection.commit();
                //Set this flag to true, if transaction is committed.
                recordsUpdated=true;
                return(recordsUpdated)
            }catch(err){
                await connection.rollback();
                console.log(err)
                return("error!")                
            }  
        
    },
    //Delete word and it's meaning.
    delete:async (engId, finId)=>{
        console.log("English id"  + engId)
            let recordDeleted=false
            const sql1 = "DELETE FROM eng_word_master where id = ?"
            const sql2 = "DELETE FROM fin_word_master where id = ?"
            const sql3 = "DELETE FROM word_meaning where eng_id = ? AND fin_id = ?"
            try{
                await connection.beginTransaction();
                await execQuery(sql3, [engId, finId])
                await execQuery(sql1, [engId])      
                console.log(sql1)
                await execQuery(sql2, [finId])              
                                
                await connection.commit();
                recordDeleted=true
                return(recordDeleted)
            }catch(err){
                await connection.rollback();
                console.log(err)
                return(recordDeleted)                
            }
    },

    findQuestions: async (qstnsObj)=>{
        console.log("qstnsObj")
        console.log(qstnsObj)
            const table1 = getTableName(qstnsObj.lang1);
            const table2 = getTableName(qstnsObj.lang2);
            const id1 = getId(qstnsObj.lang1);
            const id2 = getId(qstnsObj.lang2);

            const MAX_QSTN = 10;
            let sql, catId
            if(qstnsObj.catId!==""){
                catId = Number(qstnsObj.catId)
                sql = `SELECT ${table1}.id, ${table1}.word AS word1, ${table2}.word as word2 FROM ${table1} ` +
                        ` JOIN word_meaning ON ${table1}.id = word_meaning.${id1} `+
                        ` JOIN ${table2} ON ${table2}.id = word_meaning.${id2} `+
                        ` WHERE ${table1}.category_id = ? `                        
                return new Promise((resolve, reject)=>{
                    console.log("sql"+sql)
                connection.query(sql, [catId], (err, results)=>{
                    err ? reject(err) : resolve(results)
                })
            })
            }else{
                sql = `SELECT ${table1}.id, ${table1}.word AS word1, ${table2}.word as word2 FROM ${table1} ` +
                        ` JOIN word_meaning ON ${table1}.id = word_meaning.${id1} `+
                        ` JOIN ${table2} ON ${table2}.id = word_meaning.${id2} `+
                        ` ORDER BY RAND() LIMIT ? `                    
                return new Promise((resolve, reject)=>{
                connection.query(sql, [MAX_QSTN], (err, results)=>{
                    err ? reject(err) : resolve(results)
                })
            })
            }
            
        
    },

    close: (callback)=>{
        connection.end(()=>{
            console.log("Closing db")
            callback();
        })
    }
    
}

module.exports = connectionFunctions