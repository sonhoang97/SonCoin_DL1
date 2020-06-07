const SHA256 = require("crypto-js/sha256");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

const Block  = require("./blockModel");
const Transaction = require("./transactionModel");

class BlockChain {
  constructor() {
    this.blockChain = [];
    this.difficulty = 4;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  setBlockChain(blockChain, pendingTransactions){
    this.blockChain = blockChain;
    this.pendingTransactions = pendingTransactions;
  }

  createGenesisBlock() {
    this.blockChain.push(new Block(Date.now(), "Initial Block", ""));
  }

  getLatestBlock() {
    return this.blockChain[this.blockChain.length - 1];
  }

  minePendingTransactions(miningRewardAddress) {
    const reward = new Transaction(
      "Admin",
      miningRewardAddress,
      this.miningReward
    );
    this.pendingTransactions.push(reward);

    let block = new Block(
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );
    this.pendingTransactions = [];
    block.mineBlock(this.difficulty);
    console.log("Block successfully mined!");
    this.blockChain.push(block);
  }

  addTransaction(transaction) {

    if (!transaction.sender || !transaction.recipient) {
      throw new Error("Transaction must contain sender and recipient.");
    }

    // if (!transaction.isValid()) {
    //   throw new Error("Transaction invalid.");
    // }
    if (this.getBalanceOfAddress(transaction.sender) < transaction.amount) {
      throw new Error("Not enough coins");
    }

    let balance = this.getBalanceOfAddress(transaction.sender);
    for (const tx of this.pendingTransactions) {
      if (tx.sender === transaction.sender) balance -= tx.amount;
      if (balance < transaction.amount) throw new Error("Not enough coins");
    }

    this.pendingTransactions.push(transaction);
  }

  getBalanceOfAddress(address) {
    let balance = 0;

    for (const block of this.blockChain) {
      for (const transaction of block.transactions) {
        if (transaction.recipient === address) {
          balance += transaction.amount;
        }
        if (transaction.sender === address) {
          balance -= transaction.amount;
        }
      }
    }
    return balance;
  }

  getHistoryOfAddress(address) {
    let history = [];
    for (const block of this.blockChain) {
      for (const transaction of block.transactions) {
        if (transaction.recipient === address) {
          history.push(transaction);
        }
        if (transaction.sender === address) {
          history.push(transaction);
        }
      }
    }
    return history;
  }

  validateChain() {
    for (let i = 1; i < this.blockChain.length; i++) {
      const currentBlock = this.blockChain[i];
      const previousBlock = this.blockChain[i - 1];

      if (!currentBlock.validateTransactions()) {
        console.log("1", currentBlock.validateTransactions());
        return false;
      }

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        console.log("2", currentBlock.hash !== currentBlock.calculateHash());
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        console.log("3", currentBlock.previousHash !== previousBlock.hash);
        return false;
      }
    }
    return true;
  }
}

module.exports = BlockChain;
