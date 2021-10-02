const http = require("http");
const express = require("express");
const {PORT} = require("./src/config");

const app = express();

app.get("/list", (req, res) => {
  res.json([]);
});

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
