const CryptoJS = require("crypto-js");

function Block({ index, transactions, difficulty, prevBlockHash, minedBy, nonce, blockDataHash, dateCreated, blockHash }) {
    this.index = index;
    this.transactions = transactions;
    this.difficulty = difficulty;
    this.prevBlockHash = prevBlockHash;
    this.minedBy = minedBy;
    this.nonce = nonce;
    this.blockDataHash = blockDataHash;
    this.dateCreated = dateCreated;
    this.blockHash = blockHash;
}

Block.prototype.calculateBlockDataHash = function() {
    let blockData = {
        index: this.index,
        transactions: this.transactions.map(transaction => Object({
            from: transaction.from,
            to: transaction.to,
            value: transaction.value,
            fee: transaction.fee,
            dateCreated: transaction.dateCreated,
            data: transaction.data,
            senderPubKey: transaction.senderPubKey,
            transactionDataHash: transaction.transactionDataHash,
            senderSignature: transaction.senderSignature,
            minedInBlockIndex: transaction.minedInBlockIndex,
            transferSuccessful: transaction.transferSuccessful
        })),
        difficulty: this.difficulty,
        prevBlockHash: this.prevBlockHash,
        minedBy: this.minedBy
    };

    this.blockDataHash = CryptoJS.SHA256(blockData).toString();
};

Block.prototype.calculateBlockHash = function() {

    this.blockHash = CryptoJS.SHA256(
        this.blockDataHash + this.nonce + this.dateCreated).toString();
};


module.exports = Block;