var express = require("express"),
  app = express(),
  port = 3000,
  server = require("http").createServer(app);
const BlockChain = require("./model/blockChainModel");
const trans = require("./model/transactionModel");

app.get("/api/", function (req, res) {
  blockChain = new BlockChain();
  tran = new trans("1", "1", "1");
  blockChain.addTransaction(tran);
  return res.json(blockChain.blockChain);
});

app.post("/test", function (req, res) {
  return res.send(req.body);
});

server.listen(port, function () {
  console.log("Listening on port %s...", server.address().port);
});
