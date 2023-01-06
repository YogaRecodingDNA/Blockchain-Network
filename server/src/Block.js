const Config = require("./utils/Config");
const Transaction = require("./Transaction");
const CryptoHashUtils = require("./utils/CryptoHashUtils");


// ===================================================================================
// ============================= BLOCK CONSTRUCTOR ===================================
// ===================================================================================
function Block(index, transactions, difficulty, prevBlockHash, minedBy, blockDataHash, nonce, dateCreated, blockHash) {
    this.index = index;
    this.transactions = transactions;
    this.difficulty = difficulty;
    this.prevBlockHash = prevBlockHash;
    this.minedBy = minedBy;
    this.blockDataHash = blockDataHash;
    if(!blockDataHash) this.calculateBlockDataHash();
    this.nonce = nonce;
    this.dateCreated = dateCreated || new Date().toISOString();
    this.blockHash = blockHash;
    if (!blockHash) this.calculateBlockHash();
}


// ===================================================================================
// ========================= Calculate Block Data Hash ===============================
// ===================================================================================

Block.prototype.calculateBlockDataHash = function() {

    this.blockDataHash = CryptoHashUtils.calcBlockDataHash(
        this.index,
        this.transactions,
        this.difficulty,
        this.prevBlockHash,
        this.minedBy
    );
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
    if (Config.currentNodeURL === Config.genesisNodeURL) {
        const genesisBlock = new Block(
            0,                                          // index
            [Transaction.genesisFaucetTransaction()],   // transactions
            0,                                          // difficulty
            0,                                          // prevBlockHash
            Config.nullMinerAddress,                    // minedBy
            0,                                          // blockDataHash
            0,                                          // nonce
            Config.genesisDate,                         // dateCreated
            0                                           // blockHash
         );
        return [genesisBlock];
    } else {
        return [];
    }
};


module.exports = Block;