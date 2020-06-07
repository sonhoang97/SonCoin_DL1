var express = require("express"),
  app = express(),
  port = 3000,
  server = require("http").createServer(app);

var cors = require("cors");
const bodyParser = require("body-parser");
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

const BlockChain = require("./model/blockChainModel");
const Transaction = require("./model/transactionModel");
app.use(cors());

//get blockchain
app.get("/api/getBlockChain", function (req, res) {
  blockChain = new BlockChain();
  blockChain.createGenesisBlock();
  return res.json(blockChain);
});

app.post("/api/mining", function (req, res) {
  blockChain = new BlockChain();
  blockChain.setBlockChain(req.body.blockChain, req.body.pendingTransactions);
  var receiver = req.body.receiver;

  blockChain.minePendingTransactions(receiver);

  return res.json(blockChain);
});

app.post("/api/balance", function (req, res) {
  blockChain = new BlockChain();
  blockChain.setBlockChain(req.body.blockChain,[]);
  var receiver = req.body.receiver;

  var amount = blockChain.getBalanceOfAddress(receiver);
  return res.json(amount);
});

app.post("/api/addTransaction", function (req, res) {
  blockChain = new BlockChain();
  blockChain.setBlockChain(req.body.blockChain, req.body.pendingTransactions);
  transaction = new Transaction(req.body.sender, req.body.recipient, req.body.amount);

  blockChain.addTransaction(transaction);
  return res.json(blockChain);
});
server.listen(port, function () {
  console.log("Listening on port %s...", server.address().port);
});
