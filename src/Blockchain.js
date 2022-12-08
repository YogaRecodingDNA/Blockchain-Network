const Block = require("./Block");
const Transaction = require("./Transaction");
const CryptoHashUtils = require("./utils/CryptoHashUtils");
const Config = require("./utils/Config");

function Blockchain() {
    this.blocks = [Config.genesisBlock]; // Array of blocks in the chain
    this.pendingTransactions = []; // array of pending transactions
    this.networkNodes = new Map(); // Array of nodes in the network
    if(this.networkNodes.size === 0) {
        this.networkNodes.set(Config.currentNodeId, Config.currentNodeURL);
    }
    this.currentNodeURL = Config.currentNodeURL; // URL
    this.currentDifficulty = Config.initialDifficulty; // Integer of number of leading zeros
    this.miningJobs = {}; // A map map(blockDataHash -> Block) of blocks mined by this network node
}


Blockchain.prototype.calculateCumulativeDifficulty = function() {
    let difficulty = 0;

    for (let block of this.blocks) {
        difficulty += 16 ** block.difficulty;
    }

    return difficulty;
};

Blockchain.prototype.getConfirmedTransactions = function() {
    let confirmedTransactions = [];
    for (let block of this.blocks) {
        confirmedTransactions.push.apply(confirmedTransactions, block.transactions);
    }
    return confirmedTransactions;
};


Blockchain.prototype.getPeersData = function() {
    const peers = this.networkNodes.entries();
    let peerObj = {};

    for (const [key, value] of peers) {
        peerObj[`${key}`] = value;
    }

    return peerObj;
};
// Blockchain.prototype.addNewBlock = function(newBlock) {

// };
// Blockchain.prototype.addNewBlock = function(newBlock) {

// };
// Blockchain.prototype.addNewBlock = function(newBlock) {

// };
// Blockchain.prototype.addNewBlock = function(newBlock) {

// };
// Blockchain.prototype.addNewBlock = function(newBlock) {

// };


module.exports = Blockchain;