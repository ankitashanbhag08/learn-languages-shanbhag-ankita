require('dotenv').config()
const mysql = require('mysql');
/**
 * connection
 * @type {{connectionLimit :number, host: string, user:string, password: string, database: string, multipleStatements: boolean   }}
 */
var connection = mysql.createConnection({ 
 connectionLimit : 10,         //connection pool
 host: process.env.DB_HOST,
 user: process.env.DB_USER,
 password: process.env.DB_PASSWORD,
 database: process.env.DB_DB,
 multipleStatements: false      //prevents SQL injection
});

/**
 * Takes sql statement and parameters and executes the query.
 * @param {string} query SQL statement
 * @param {array} params parameters for the statement
 * @returns {Promise} result of the execution
 */
const execQuery = (query, params) => {
    return new Promise((resolve, reject) =>{
        connection.query(query, params, (err, result) => {
            if (err)
                return reject(err);
            resolve(result);
        });
    });
}

/**
 * Takes language and returns corresponding table name.
 * @param {string} type language
 * @returns {string} table name
 */
function getTableName(type) {
  var table = {
    'English': 'eng_word_master',
    'Finnish': 'fin_word_master',
    'German' : 'german_word_master',
  };
  return table[type]
}

/**
 * Takes language and returns name of primary key column, corresponding to that language.
 * @param {string} type language
 * @returns {string} name of primary key column in database
 */
function getId(type) {
  var id = {
    'English': 'eng_id',
    'Finnish': 'fin_id',
    'German' : 'german_id'
  };
  return id[type]
}

/**
 * Database functions for CRUD operation.
 * @module connectionFunctions
 */
let connectionFunctions = {

    /**
     * Makes a connection with database.
     * @alias module:connectionFunctions.connect
     * @param {function} callback 
     */
    connect:(callback)=>{
        connection.connect((err)=>{
            callback();
        });
    },    
       
    /**
     * Fetch categories
     * @alias module:connectionFunctions.findTags
     * @returns {Promise} array of categories
     * @returns {Promise} error in case of some exception
     */
    findTags:()=>{
        let sql='SELECT * FROM category_master'
        console.log(sql)
        return new Promise((resolve, reject)=>{
                connection.query(sql, (err, results)=>{
                err ? reject(err) : resolve(results)
            })
        })
        
    },

    /**
     * Inserts new category into category_master
     * @alias module:connectionFunctions.saveTag
     * @param {string} newTag name of the category
     * @returns {Promise} inserted id
     * @returns {Promise} error in case of some exception
     */
    saveTag:(newTag)=>{
        let sql = "INSERT INTO category_master (name) VALUES (?) "
        return new Promise((resolve, reject)=>{
            connection.query(sql, [newTag], (err, results)=>{
                err ? reject(err) : resolve(results.insertId)
            })
        })
    },

    /**
     * Fetch records from database
     * @alias module:connectionFunctions.findAll
     * @returns {Promise} array of objects containing words, foreign words,categories and corresponding ids.
     * @returns {Promise} error in case of some exception
     */
    findAll: () =>{
        let sql = "SELECT eng_word_master.id as eng_id,eng_word_master.word as eng_word," +
                    " fin_word_master.id AS fin_id,fin_word_master.word as fin_word, " +
                    " german_word_master.word as german_word, german_word_master.id as german_id, " +
                    " category_master.name, category_master.id as cat_id FROM eng_word_master" + 
                    " JOIN word_meaning ON eng_word_master.id = word_meaning.eng_id"+
                    "  JOIN fin_word_master ON fin_word_master.id = word_meaning.fin_id"+
                    "  JOIN german_word_master ON german_word_master.id = word_meaning.german_id"+
                    " LEFT OUTER JOIN category_master ON eng_word_master.category_id = category_master.id;"  
        console.log(sql)      
        return new Promise((resolve, reject)=>{
                connection.query(sql, (err, results)=>{
                err ? reject(err) : resolve(results)
            })
        })
        
    },

    /**
     * Saves the word in database.
     * @alias module:connectionFunctions.save
     * @param {object} newWord containingword to be saved, meaning and category
     * @returns {Promise} newly inserted id in english table and finnish table
     * @returns {Promise} err in case of exception
     */
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
    
    /**
     * Updates record in database. This is a transaction.
     * @alias module:connectionFunctions.update
     * @param {object} word contains name of the word to be updated, meaning, category and correspomding ids.
     * @returns {Promise} whether record is inserted or not
     * @returns {Promise} err in case of exception
     */
    update: async(word)=>{
         console.log(word)
         let category=null;
         //If category is not given the insert category id id set tu NULL.
            category = (word.category==="") ? category : Number(word.category);
         let finId = Number(word.finId)
         let engId=Number(word.engId)
         let germanId=Number(word.germanId)
          
        let recordsUpdated = false
        let sql1 = `UPDATE eng_word_master SET word = ?, category_id = ? WHERE id = ?`
        let sql2 = `UPDATE fin_word_master SET word = ?, category_id = ? WHERE id = ?`
        let sql3 = `UPDATE german_word_master SET word = ?, category_id = ? WHERE id = ?`
        try{
                await connection.beginTransaction();
                console.log(word)
                await execQuery(sql1, [word.engWord, category, engId])     
                
                await execQuery(sql2, [word.finWord, category, finId])
                await execQuery(sql3, [word.germanWord, category, germanId])
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

    /**
     * Deletes word and it's meaning.
     * @alias module:connectionFunctions.delete
     * @param {number} engId id in eng_word_master
     * @param {number} finId id in fin_word_master
     * @returns {Promise} whether record is deleted or not
     * @returns {Promise} err in case of exception
     */
    delete:async (engId, finId, germanId)=>{
        console.log("English id"  + engId)
            let recordDeleted=false
            const sql1 = "DELETE FROM eng_word_master where id = ?"
            const sql2 = "DELETE FROM fin_word_master where id = ?"
            const sql3 = "DELETE FROM german_word_master where id = ?"
            const sql4 = "DELETE FROM word_meaning where eng_id = ? AND fin_id = ?"
            try{
                await connection.beginTransaction();
                await execQuery(sql4, [engId, finId])
                await execQuery(sql1, [engId])      
                console.log(sql1)
                await execQuery(sql2, [finId])              
                await execQuery(sql3, [germanId])                
                await connection.commit();
                recordDeleted=true
                return(recordDeleted)
            }catch(err){
                await connection.rollback();
                console.log(err)
                return(recordDeleted)                
            }
    },

    /**
     * Gets questions and answers from the database, corresponding to the selected languages and category.
     * @alias module:connectionFunctions.findQuestions
     * @param {object} qstnsObj 
     * @returns {Promise} array of objects containing id, word, category
     * @returns {Promise} error in case of some exception
     */
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
    /**
     * Closes the database connection.
     * @alias module:connectionFunctions.close
     * @param {function} callback 
     */
    close: (callback)=>{
        connection.end(()=>{
            console.log("Closing db")
            callback();
        })
    }
    
}

/**
 * Database functions for CRUD operation.
 * @module connectionFunctions
 */
module.exports = connectionFunctions