require("dotenv").config() 
const express = require("express");
const app = express();
const port = process.env.port || 8080

const db = [{ name: "tiina" }, { name: "jack" }];
app.use(cors())
app.use((express.static("frontend/build")))
app.get("/names", (req, res) => {
  res.send(db);
});

const server = app.listen(port, () => {
  console.log(`Listening on port ${server.address().port}`);
}); 