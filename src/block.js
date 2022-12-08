const CryptoHashUtils = require("./utils/CryptoHashUtils");

function Block(index, transactions, difficulty, prevBlockHash, minedBy, blockDataHash, nonce, dateCreated, blockHash, blockReward) {
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
    
    this.blockReward = blockReward;
}

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

    this.blockDataHash = CryptoHashUtils.sha256(blockData).toString();

    // console.log("BLOCK DATA HASH", this.blockDataHash);
};

Block.prototype.calculateBlockHash = function() {
    this.blockHash = CryptoHashUtils.sha256(
        this.blockDataHash + this.nonce + this.dateCreated).toString();

    // console.log("BLOCK HASH", this.blockHash);
};


module.exports = Block;