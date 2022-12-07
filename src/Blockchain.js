const Block = require("./Block");
const Transaction = require("./Transaction");
const CryptoHashUtils = require("./utils/CryptoHashUtils");
const Config = require("./utils/Config");

function Blockchain() {
    this.blocks = [Config.genesisBlock]; // Block[]
    this.pendingTransactions = []; // Transaction[]
    this.currentNodeURL = Config.currentNodeURL;
    this.currentDifficulty = Config.initialDifficulty; // integer
    this.miningJobs = {}; // A map map(blockDataHash -> Block) blocks mined by this network node

}

Blockchain.prototype.addNewBlock = function(newBlock) {

};