const SHA256 = require("crypto-js/sha256");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");

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
    if (signingKey.getPublic("hex") !== this.sender) {
      throw new Error("You cannot sign transactions for other wallets.");
    }

    const hash = this.calculateHash();
    const signature = signingKey.sign(hash, "base64");
    this.signature = signature.toDER("hex");
  }

  isValid() {
    if (this.sender === null) {
      return true;
    }

    if (!this.signature || this.signature === "") {
      throw new Error("No signature found.");
    }

    const publicKey = ec.keyFromPublic(this.sender, "hex");
    return publicKey.verify(this.calculateHash(), this.signature);
  }
}
module.exports.Transaction = Transaction;
