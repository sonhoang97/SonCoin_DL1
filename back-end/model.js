const SHA256 = require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction {
  constructor(sender, recipient, amount) {
    this.sender = sender;
    this.recipient = recipient;
    this.amount = amount;
  }

  calculateHash() {
    return SHA256(this.sender + this.recipient + this.amount).toString();
  }

  signTransaction(signingKey) {
    if (signingKey.getPublic('hex') !== this.sender) {
      throw new Error('You cannot sign transactions for other wallets.');
    }

    const hash = this.calculateHash();
    const signature = signingKey.sign(hash, 'base64');
    this.signature = signature.toDER('hex');
  }

  isValid() {
    if (this.sender === null) {
      return true;
    }

    if (!this.signature || this.signature === '') {
      throw new Error('No signature found.');
    }

    const publicKey = ec.keyFromPublic(this.sender, 'hex');
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}

class Block {
  constructor(timestamp, transactions, previousHash = '') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.timestamp +
        JSON.stringify(this.transactions) +
        this.previousHash +
        this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while (
      this.hash.substring(0, difficulty) !== Array(difficulty + 1).join('0')
    ) {
      this.nonce++;
      this.hash = this.calculateHash();
    }

    console.log('Block mined: ', this.hash);
  }

  validateTransactions() {
    for (const transaction of this.transactions) {
      if (!transaction.isValid()) {
        return false;
      }
    }
    return true;
  }
}

class BlockChain {
  constructor() {
    this.blockChain = [this.createGenesisBlock()];
    this.difficulty = 4;
    this.pendingTransactions = [];
    this.miningReward = 100;
  }

  createGenesisBlock() {
    return new Block(Date.now(), 'Initial Block', '');
  }

  getLatestBlock() {
    return this.blockChain[this.blockChain.length - 1];
  }

  minePendingTransactions(miningRewardAddress) {
    const reward = new Transaction(
      null,
      miningRewardAddress,
      this.miningReward
    );
    this.pendingTransactions.push(reward);

    let block = new Block(
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );
    block.mineBlock(this.difficulty);
    console.log('Block successfully mined!');
    this.blockChain.push(block);
    this.pendingTransactions = [];
  }

  addTransaction(transaction) {
    if (!transaction.sender || !transaction.recipient) {
      throw new Error('Transaction must contain sender and recipient.');
    }

    if (!transaction.isValid()) {
      throw new Error('Transaction invalid.');
    }

    if (this.getBalanceOfAddress(transaction.sender) < transaction.amount) {
      throw new Error('Not enough coins');
    }

    let balance = this.getBalanceOfAddress(transaction.sender);
    for (const tx of this.pendingTransactions) {
      if (tx.sender === transaction.sender) balance -= tx.amount;
      if (balance < transaction.amount) throw new Error('Not enough coins');
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
        console.log('1', currentBlock.validateTransactions());
        return false;
      }

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        console.log('2', currentBlock.hash !== currentBlock.calculateHash());
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        console.log('3', currentBlock.previousHash !== previousBlock.hash);
        return false;
      }
    }
    return true;
  }
}

module.exports.BlockChain = BlockChain;
module.exports.Transaction = Transaction;