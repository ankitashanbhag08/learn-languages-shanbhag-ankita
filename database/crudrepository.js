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
                return("saved!")
            }catch(err){
                await connection.rollback();
                console.log(err)
                return("error!")                
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