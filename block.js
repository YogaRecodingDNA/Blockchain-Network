const CryptoJS = require("cryto-js");

function Block(index, transactions, difficulty, prevBlockHash, minedBy, nonce, blockDataHash, dateCreated, blockHash) {
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

    let blockDataJSON = JSON.stringify(blockData);

    this.blockDataHash = CryptoJS.SHA256(blockDataJSON);
};

Block.prototype.calculateBlockHash = function() {
    // const blockDataHash = this.blockDataHash.toString();
    // const nonce = this.nonce.toString();
    // const dateCreated = this.dateCreated.toString();
    // const dataToHash = blockDataHash + nonce + dateCreated;
    const data = {
        blockDataHash: this.blockDataHash.toString(),
        nonce: this.nonce.toString(),
        dateCreated: this.dateCreated.toString()
    };

    const dataJSON = JSON.stringify(data);

    this.blockHash = CryptoJS.SHA256(dataToHash);
};