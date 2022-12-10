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

/**
 * @notice - Calculates the total mining difficulty of the chain
 * @returns - Integer: Total mining difficulty of the chain
 */
Blockchain.prototype.calculateCumulativeDifficulty = function() {
    let difficulty = 0;
    for (let block of this.blocks) {
        difficulty += 16 ** block.difficulty;
    }
    return difficulty;
};

Blockchain.prototype.getLastBlockOnChain = function() {
    return this.blocks[this.blocks.length - 1];
};
Blockchain.prototype.createNewTransaction = function(transactionData) {
    // VALIDATE address
    // VALIDATE public key
    // VALIDATE private key
    // VALIDATE signature
    // VALIDATE "value"
    // VALIDATE fee
    // CHECKS that "value" is >= 0 
    // CHECKS sender account balance >= "value" + "fee" 
    // CHECKS for collisions -> skip duplicated transactions 
    // ADD TRANSACTION to pending transactions pool 
    // BROADCASTS TRANSACTION to peers 

    let date = new Date();
    // Create new Transaction params (to, value, fee, dateCreated, data, senderPubKey, senderPrivKey)
    const newTransaction = new Transaction(
        transactionData.to,
        transactionData.value,
        transactionData.fee,
        date.toISOString(),
        transactionData.data,
        transactionData.senderPubKey,
        transactionData.senderPrivKey
    );

    // console.log("TRANSACTION =====> ", newTransaction)
    const newTransactionDataJSON = JSON.stringify(newTransaction);
    // console.log("JSON TRANSACTION =====> ", newTransactionDataJSON)
    newTransaction.transactionDataHash = CryptoHashUtils.sha256(newTransactionDataJSON).toString();
    // console.log("TRANSACTION WITH HASH =====> ", newTransaction)

    return newTransaction;
};

Blockchain.prototype.addNewTransactionToPendingTransactions = function(transactionObject) {

    
};


/**
 * @notice - Locates all confirmed transactions within the blockchain
 * @returns - An array the total confirmed transactions of each block in the chain 
 */
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

// RESET THE BLOCKCHAIN ==================================================================
// =======================================================================================
Blockchain.prototype.resetChain = function() {
    this.pendingTransactions = [];
    this.blocks = [this.blocks[0]];
    this.currentDifficulty = Config.initialDifficulty;

    const isReset =  ( // IF...
        this.blocks.length === 1
        && this.blocks[0] === Config.genesisBlock
        && this.pendingTransactions.length === 1 //TODO: Check only genesis txs are pending
        && this.currentDifficulty === 5
        ? true
        : false
    );

    return isReset;
};


// Blockchain.prototype.addNewBlock = function(newBlock) {

// };
// Blockchain.prototype.addNewBlock = function(newBlock) {

// };
// Blockchain.prototype.addNewBlock = function(newBlock) {

// };


module.exports = Blockchain;