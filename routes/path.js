require('dotenv').config()
const express = require("express");
const router = express.Router()
const database = require('../database/crudrepository')

router.get("/tags", async (req, resp)=>{
    try{
        console.log("getting tags back")
        const results = await database.findTags();
        console.log(results)
        resp.send(results);
    }catch(err){
        //500:Internal Server Error
        resp.status(500).end();
    }    
});

router.get("/", async (req, resp)=>{
    try{
        console.log("getting records")
        const results = await database.findAll();
        resp.send(results);
    }catch(err){
        //500:Internal Server Error
        resp.status(500).end();
    }    
});

router.post('/', async (req, resp)=>{
    try{
      console.log("Adding Words")
        let newWord = req.body;
        console.log(newWord)        
          const respObj=await database.save(newWord)
          //201: New source created/ new row added to database.
            resp.status(201).send(respObj)              
        
    }catch(err){
        //500:Internal Server Error
        resp.status(500).end();
    }
})

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

router.delete('/', async (req, resp)=>{
    try{
        console.log("delete")
        //idTodelete: object that contains id to be deleted.
        const idTodelete=req.query;
        let finId = Number(idTodelete.finId);
        let engId=Number(idTodelete.engId)
        const rowDeleted = await database.delete(engId, finId);        
        if(rowDeleted){
            //200 OK:The server has fulfilled the request.
            resp.status(200).send("Record Deleted");
        }else{
            //404 Not Found:The server can not find the requested resource.
            resp.status(404).send("Record nor deleted"); 
        } 
    }catch(err){
        //500:Internal Server Error
        resp.status(500).end();
    }
});
module.exports=router