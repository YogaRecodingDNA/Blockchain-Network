const { GENESIS_DATA } = require("../config");
// const Transaction = require("./transaction");
const CryptoJS = require("crypto-js");
// const EC = require('elliptic').ec;
// const secp256k1 = new EC('secp256k1');

function Block(index, transactions, difficulty, prevBlockHash, minedBy, blockDataHash, nonce, dateCreated, blockHash) {
    this.index = index;
    this.transactions = transactions;
    this.difficulty = difficulty;
    this.prevBlockHash = prevBlockHash;
    this.minedBy = minedBy;
    this.blockDataHash = blockDataHash;
        // Calculate blockDataHash if undefined 
    if(this.blockDataHash === undefined) this.calculateBlockDataHash();
    
    this.nonce = nonce;
    this.dateCreated = dateCreated;
    this.blockHash = blockHash;
        // Calculate blockHash if undefined 
    if(this.blockHash === undefined) this.calculateBlockHash();
}

Block.genesis = function() {
    // console.log("GENESIS_DATA", GENESIS_DATA);
    const genesisBlock = GENESIS_DATA;
    return genesisBlock;
};

Block.mineNewBlock = function(previousBlock) {
    // console.log("previousBlock.blockHash ===== ", previousBlock.blockHash);
    console.log("previousBlock ====== ", previousBlock);
    // console.log("data ====== ", data);
    console.log("DATE ====== ", Date.now());
    return new this(
        1,
        ["transactions"],
        2,
        // previousBlock.blockHash,
        "0987098y09ausdhfasdhfoiauhf0a98sf",
        undefined,
        1234,
        "2022-12-12T00:00:00.000Z",
        undefined
    );
};

Block.prototype.calculateBlockDataHash = function() {
    let blockData = {
        index: this.index,
        transactions: this.transactions.map((transaction) => 
            Object({
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
            })
        ),
        difficulty: this.difficulty,
        prevBlockHash: this.prevBlockHash,
        minedBy: this.minedBy
    };

    this.blockDataHash = CryptoJS.SHA256(blockData).toString();

    console.log("BLOCK DATA HASH", this.blockDataHash);
};

Block.prototype.calculateBlockHash = function() {
    
    this.blockHash = CryptoJS.SHA256(
        this.blockDataHash + this.nonce + this.dateCreated).toString();

    console.log("BLOCK HASH", this.blockHash);
};


module.exports = Block;


// AUTO GENERATED ADDRESS / PRIVATE KEY
    // Address: 0x0987F4c323B5c85890b82925292B5E7d4bf5B416
    // Private key: 1d513f8a9689d2c43852ab9a9777ed333811c1d9d6e1b90c47a7e9e214153308
