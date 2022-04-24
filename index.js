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
          const saved=await database.save(newWord)
            resp.status(201).send(saved)              
        
    }catch(err){
        resp.status(500).end();
    }
})

const server = app.listen(port, () => {
  console.log(`Listening on port ${server.address().port}`);
}); 