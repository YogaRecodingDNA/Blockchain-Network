const CryptoJS = require("crypto-js");
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

// Transaction constructor function
function Transaction({ from, to, value, fee, dateCreated, data, senderPubKey, transactionDataHash, senderSignature, minedInBlockIndex, transferSuccessful }) {
    this.from = from;
    this.to = to;
    this.value = value;
    this.fee = fee;
    this.dateCreated = dateCreated;
    this.data = data;
    this.senderPubKey = senderPubKey;
    this.transactionDataHash = transactionDataHash;
    this.senderSignature = senderSignature;
    this.minedInBlockIndex = minedInBlockIndex;
    this.transferSuccessful = transferSuccessful;
}


// Method - Calculate Transaction Data Hash
Transaction.prototype.calculateTransactionDataHash = function() {
    const transactionData = {
        from: this.from,
        to: this.to,
        value: this.value,
        fee: this.fee,
        dateCreated: this.dateCreated,
        data: this.data,
        senderPubKey: this.senderPubKey
    };

    this.transactionDataHash = CryptoJS.SHA256(transactionData).toString();
    
    if (!transactionData.data) delete transactionData.data;

    return JSON.stringify(transactionData);
};


// Method - Sign A Transaction
Transaction.prototype.signTransaction = function(privateKey) {
    const property = ec.keyFromPrivate(privateKey);
    const transactionDataJSON = calculateTransactionDataHash().split(" ").join("");
    const signature = property.sign(transactionDataJSON);

    this.senderSignature = [signature.r.toString(16), signature.s.toString(16)];
};


module.exports = Transaction;