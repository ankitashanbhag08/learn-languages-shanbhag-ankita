const express = require("express");
const app = express();
const port = process.env.PORT || 8080;
var cors = require('cors') //supports secure cross-origin requests between browsers and servers.
const router = require('./routes/path.js')

app.use(express.json(), (req, resp, next)=>{
    next();
});
app.use(cors(), (req, resp, next)=>{
    next();
});
app.use(express.static("frontend/build"),  (req, resp, next)=>{
    next();
});

app.use('/teach', router, (req, resp, next)=>{
    next();
})

const server = app.listen(port, () => {
  console.log(`Listening on port ${server.address().port}`);
}); 