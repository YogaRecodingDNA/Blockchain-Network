const Block = require("./Block");
const Transaction = require("./Transaction");
const CryptoHashUtils = require("./utils/CryptoHashUtils");
const config = require("./utils/Config");

function Blockchain() {
    this.blocks = [config.genesisBlock];
    this.pendingTransactions = [];

}

Blockchain.prototype.addNewBlock = function(newBlock) {

};