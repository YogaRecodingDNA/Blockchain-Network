const CryptoHashUtils = require("./utils/CryptoHashUtils");

function Block(index, transactions, difficulty, prevBlockHash, minedBy, nonce, dateCreated) {
    this.index = index;
    this.transactions = transactions;
    this.difficulty = difficulty;
    this.prevBlockHash = prevBlockHash;
    this.minedBy = minedBy;
    this.blockDataHash = this.calculateBlockDataHash();
    this.nonce = 0;
    this.dateCreated = dateCreated;
    this.blockHash = this.calculateBlockHash();
    // if(this.blockHash === undefined) this.calculateBlockHash();
    // this.blockReward;
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

    const blockDataJSON = JSON.stringify(blockData).split(" ").join("");

    return CryptoHashUtils.sha256(blockDataJSON).toString();
};

Block.prototype.calculateBlockHash = function() {
    return CryptoHashUtils.sha256(
        this.blockDataHash + this.nonce + this.dateCreated).toString();
};


module.exports = Block;