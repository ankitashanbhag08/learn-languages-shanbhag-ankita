require('dotenv').config()
const express = require("express");
const database = require('../database/crudrepository')
/**
 * Router-level middleware
 * @type {object}
 */
const router = express.Router()


/**
 * handler for teach/tags path, sends list of categories
 * @module router
 * @param {string} /tags http request path
 * @param {Function} anonymous handles request and response objects
 * @returns {response} result of the execution.
 */
router.get("/tags", async (req, resp)=>{
    try{
        console.log("getting tags back")
        const results = await database.findTags();
        console.log(results)
        resp.send(results);
    }catch(err){
        console.log(err)
        //500:Internal Server Error
        resp.status(500).end();
    }    
});

/**
 * handler for teach/qstns path, sends list of questions for test.
 * @module router
 * @param {string} /qstns http request path
 * @param {Function(req, resp)} anonymous handles request and response objects
 * @returns {response} result of the execution.
 */
router.get("/qstns", async (req, resp)=>{
    try{
        console.log("getting questions")
        let qstnsObj = req.query;
        const results = await database.findQuestions(qstnsObj);
        resp.send(results);
    }catch(err){
        console.log(err)
        //500:Internal Server Error
        resp.status(500).end();
    }    
});

/**
 * handler for /teach path, sends list of words, tranlates words and category.
 * @module router
 * @param {string} / http request path
 * @param {Function(req, resp)} anonymous handles request and response objects
 * @returns {response} result of the execution.
 */
router.get("/", async (req, resp)=>{
    try{
        console.log("getting records")
        const results = await database.findAll();
        resp.send(results);
    }catch(err){
        console.log(err)
        //500:Internal Server Error
        resp.status(500).end();
    }    
});

/**
 * handler for /teach/tags path, adds new tag.
 * @module router
 * @param {string} /tags http request path
 * @param {Function(req, resp)} anonymous handles request and response objects
 * @returns {response} result of the execution.
 */
router.post('/tags', async (req, resp)=>{
    try{
      console.log("Adding Tags")
        let newTag = req.body;
        console.log(newTag)        
          const newId=await database.saveTag(newTag.tag)
          //201: New source created/ new row added to database.
          resp.status(201).send(`${newId}`)             
        
    }catch(err){
        //500:Internal Server Error
        console.log(err)
        resp.status(500).end();
    }
})

/**
 * handler for /teach path, adds new word, tranlated word and category.
 * @module router
 * @param {string} / http post request path
 * @param {Function(req, resp)} anonymous handles request and response objects
 * @returns {response} result of the execution.
 */
router.post('/', async (req, resp)=>{
    try{
      console.log("Adding Words")
        let newWord = req.body;
        console.log(newWord)        
          const respObj=await database.save(newWord)
          //201: New source created/ new row added to database.
            resp.status(201).send(respObj)              
        
    }catch(err){
        console.log(err)
        //500:Internal Server Error
        resp.status(500).end();
    }
})

/**
 * handler for /teach/ path, updates the requested word, tranlated words and category.
 * @module router
 * @param {string} /tags http patch request path
 * @param {Function(req, resp)} anonymous handles request and response objects
 * @returns {response} result of the execution.
 */
router.patch('/:id([0-9]+)', async (req, resp)=>{
    try{
        console.log("Updating Words")
        let wordToEdit = req.body;
        console.log(wordToEdit)        
        const updated=await database.update(wordToEdit)
        //200 OK:The server has fulfilled the request.
        if(updated) resp.status(200).send("Record Updated") 
        
    }catch(err){
        console.log(err)
        //500:Internal Server Error
        resp.status(500).end();
    }
});

/**
 * handler for /teach, deletes the requested word, tranlated words and category.
 * @module router
 * @param {string} / http delete request path
 * @param {Function(req, resp)} anonymous handles request and response objects
 * @returns {response} result of the execution.
 */
router.delete('/', async (req, resp)=>{
    try{
        console.log("delete")
        //idTodelete: object that contains id to be deleted.
        const idTodelete=req.query;
        let finId = Number(idTodelete.finId);
        let engId=Number(idTodelete.engId);
        let germanId=Number(idTodelete.germanId)
        const rowDeleted = await database.delete(engId, finId, germanId);        
        if(rowDeleted){
            //200 OK:The server has fulfilled the request.
            resp.status(200).send("Record Deleted");
        }else{
            //404 Not Found:The server can not find the requested resource.
            resp.status(404).send("Record not deleted"); 
        } 
    }catch(err){
        console.log(err)
        //500:Internal Server Error
        resp.status(500).end();
    }
});

/**
 * Handler that enables defining multiple routes for a path. 
 * @module router
 */
module.exports=router