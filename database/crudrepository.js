require('dotenv').config()
const mysql = require('mysql')

var connection = mysql.createConnection({ 
 connectionLimit : 10,
 host: process.env.DB_HOST,
 user: process.env.DB_USER,
 password: process.env.DB_PASSWORD,
 database: process.env.DB_DB,
 multipleStatements: false
});
const insertData = (query, params) => {
    return new Promise((resolve, reject) =>{
        connection.query(query, params, (err, result) => {
            if (err)
                return reject(err);
            resolve(result);
        });
    });

}

let connectionFunctions = {
    connect:(callback)=>{
        connection.connect((err)=>{
            callback();
        });
    },
    
    findTags:()=>{
        let sql='SELECT * FROM category_master'
        console.log(sql)
        return new Promise((resolve, reject)=>{
                connection.query(sql, (err, results)=>{
                err ? reject(err) : resolve(results)
            })
        })
        
    },
    findAll: () =>{
        let sql = "SELECT eng_word_master.id as eng_id,eng_word_master.word as eng_word,fin_word_master.id AS fin_id,fin_word_master.word as fin_word, category_master.name, category_master.id as cat_id FROM eng_word_master" + 
                    " JOIN word_meaning ON eng_word_master.id = word_meaning.eng_id"+
                    " JOIN fin_word_master ON fin_word_master.id = word_meaning.fin_id"+
                    " JOIN category_master ON eng_word_master.category_id = category_master.id;"  
        console.log(sql)      
        return new Promise((resolve, reject)=>{
                connection.query(sql, (err, results)=>{
                err ? reject(err) : resolve(results)
            })
        })
        
    },

    save:async (newWord)=>{
        
            const sql1 = "INSERT INTO eng_word_master (word, category_id) VALUES (?, ?)"
            const sql2 = "INSERT INTO fin_word_master (word, category_id) VALUES (?, ?)"
            const sql3 = "INSERT INTO word_meaning (eng_id, fin_id) VALUES (?, ?);"
            try{
                await connection.beginTransaction();
                let result1 = await insertData(sql1, [newWord.engWord, newWord.category])      
                
                let result2 = await insertData(sql2, [newWord.finWord, newWord.category])
                
                let result3 = await insertData(sql3, [result1.insertId, result2.insertId])                
                await connection.commit();
                return({engId:result1.insertId, finId:result2.insertId})
            }catch(err){
                await connection.rollback();
                console.log(err)
                return("error!")                
            }   
    },
    
    update: async(word)=>{
         console.log(word)
         let category = Number(word.category)
         let finId = Number(word.engId)
         let engId=Number(word.engId)
          
        let recordsUpdated = false
        let sql1 = `UPDATE eng_word_master SET word = ?, category_id = ? WHERE id = ?`
        let sql2 = `UPDATE fin_word_master SET word = ?, category_id = ? WHERE id = ?`
        try{
                await connection.beginTransaction();
                console.log(word)
                let result1 = await insertData(sql1, [word.engWord, category, engId])      
                
                let result2 = await insertData(sql2, [word.finWord, category, finId])
                
                //let result3 = await insertData(sql3, [result1.insertId, result2.insertId])                
                await connection.commit();
                recordsUpdated=true;
                return(recordsUpdated)
            }catch(err){
                await connection.rollback();
                console.log(err)
                return("error!")                
            }  
        //try{
           // await connection.beginTransaction()
           /* Promise.all([insertData(sql1, [word.engWord, word.category, word.engId]), insertData(sql2, [word.finWord, word.category, word.finId])])
            .then((data) => console.log("done"))
            .catch((err)=>console.log(err));*/
           // await connection.commit();
            
       // }catch(err){
        //    await connection.rollback();
         //   console.log(err)
         //   return("error!")
       // }
    },

    close: (callback)=>{
        connection.end(()=>{
            console.log("Closing db")
            callback();
        })
    }
}

module.exports = connectionFunctions