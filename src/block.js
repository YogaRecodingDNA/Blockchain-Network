const { GENESIS_DATA } = require("../config");
const Transaction = require("./transaction");
const CryptoJS = require("crypto-js");
const EC = require('elliptic').ec;
const secp256k1 = new EC('secp256k1');

function Block(index, transactions, difficulty, prevBlockHash, minedBy, blockDataHash, nonce, dateCreated, blockHash) {
    this.index = index;
    this.transactions = transactions;
    this.difficulty = difficulty;
    this.prevBlockHash = prevBlockHash;
    this.minedBy = minedBy;
    this.blockDataHash = blockDataHash;
    this.nonce = nonce;
    this.dateCreated = dateCreated;
    this.blockHash = blockHash;
}

Block.genesis = function() {

    return new this(GENESIS_DATA);
};

Block.mineNewBlock = function({ previousBlock, data }) {
    console.log("previousBlock.blockHash ===== ", previousBlock.blockHash);
    console.log("data ====== ", data);
    return new this({
        dateCreated: Date.now(),
        prevBlockHash: previousBlock.blockHash,
        data
    });
};

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


// AUTO GENERATED ADDRESS / PRIVATE KEY
    // Address: 0x0987F4c323B5c85890b82925292B5E7d4bf5B416
    // Private key: 1d513f8a9689d2c43852ab9a9777ed333811c1d9d6e1b90c47a7e9e214153308
