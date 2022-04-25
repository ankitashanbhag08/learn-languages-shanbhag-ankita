require('dotenv').config()
const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
var cors = require('cors')
const database = require('./database/crudrepository')

app.use(express.json());
app.use(cors())
app.use(express.static("frontend/build"));


app.get("/tags", async (req, resp)=>{
    try{
        console.log("getting tags back")
        //const filters=req.query;
        const results = await database.findTags();
        console.log(results)
        resp.send(results);
    }catch(err){
        resp.status(500).end();
    }    
});

app.get("/teach", async (req, resp)=>{
    try{
        console.log("get")
        //const filters=req.query;
        const results = await database.findAll();
        resp.send(results);
    }catch(err){
        resp.status(500).end();
    }    
});

app.post('/teach', async (req, resp)=>{
    try{
      console.log("Adding Words")
        let newWord = req.body;
        console.log(newWord)        
          const respObj=await database.save(newWord)
            resp.status(201).send(respObj)              
        
    }catch(err){
        resp.status(500).end();
    }
})

app.patch('/teach/:id([0-9]+)', async (req, resp)=>{
    try{
        console.log("Updating Words")
        let wordToEdit = req.body;
        console.log(wordToEdit)        
        const updated=await database.update(wordToEdit)
        if(updated) resp.status(200).send("Record Updated") 
        
    }catch(err){
        console.log(err)
        resp.status(500).end();
    }
});

app.delete('/teach', async (req, resp)=>{
    try{
        console.log("delete")
        const idTodelete=req.query;
        let finId = Number(idTodelete.finId);
        let engId=Number(idTodelete.engId)
        const rowDeleted = await database.delete(engId, finId);        
        if(rowDeleted){
            //204 No Content:The server has fulfilled the request but does not need to return a response body.
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
const server = app.listen(port, () => {
  console.log(`Listening on port ${server.address().port}`);
}); 