const Config = require("./utils/Config");
const Transaction = require("./Transaction");
const CryptoHashUtils = require("./utils/CryptoHashUtils");

// ===================================================================================
// ============================= BLOCK CONSTRUCTOR ===================================
// ===================================================================================
function Block(index, transactions, difficulty, prevBlockHash, minedBy, dateCreated) {
    this.index = index;
    this.transactions = transactions;
    this.difficulty = difficulty;
    this.prevBlockHash = prevBlockHash;
    this.minedBy = minedBy;
    this.blockDataHash = this.calculateBlockDataHash();
    this.nonce = 0;
    this.dateCreated = dateCreated;
    this.blockHash = undefined;
}


// ===================================================================================
// ========================= Calculate Block Data Hash ===============================
// ===================================================================================

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


// ===================================================================================
// ======================= Calculate Block Hash ======================================
// ===================================================================================
Block.prototype.calculateBlockHash = function() {
    this.blockHash = CryptoHashUtils.sha256(
        this.blockDataHash + this.nonce + this.dateCreated).toString();
};


// ===================================================================================
// ========================== GENESIS BLOCK ==========================================
// ===================================================================================
Block.genesisBlock = function() {
    return new Block(
        0,                                      // index
        [Transaction.genesisFaucetTransaction()], // transactions
        0,                                      // difficulty
        undefined,                              // prevBlockHash
        Config.nullMinerAddress,                // minedBy
        0,                                      // nonce
        Config.genesisDate                      // dateCreated
     );
};


module.exports = Block;