const Block = require("./Block");
const Transaction = require("./Transaction");
const CryptoHashUtils = require("./utils/CryptoHashUtils");
const ValidationUtils = require("./utils/ValidationUtils");
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

Blockchain.prototype.getPendingTransactions = () => {
    return this.pendingTransactions;
}

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

Blockchain.prototype.getAllTransactions = () => {
    let transactions = this.getConfirmedTransactions();
    transactions.push.apply(transactions, this.pendingTransactions);
    return transactions;
}

Blockchain.prototype.findTransactionByDataHash = (hash) => {
    const allTransactions = this.getAllTransactions;
    let targetTransactions = allTransactions.filter( transaction => 
        transaction.transactionDataHash === hash);
    return targetTransactions[0];
}

Blockchain.prototype.createNewTransaction = function(transactionData) {
    // CHECKS for missing property fields keys
    const missingFields = ValidationUtils.isMissing_FieldKeys(transactionData);
    if (missingFields) {return {  errorMsg: missingFields}};
    // CHECKS for invalid property fields keys
    const invalidFields = ValidationUtils.isValid_FieldKeys(transactionData);
    if (invalidFields) {return {  errorMsg: invalidFields}};
    // VALIDATE address
    const isValidAddress = ValidationUtils.isValidAddress(transactionData.to);
    if (!isValidAddress) { return { errorMsg: "Invalid Recipient Address"} };
    // VALIDATE public key
    const isValidPublicKey = ValidationUtils.isValidPublicKey(transactionData.senderPubKey);
    if (!isValidPublicKey) { return { errorMsg: "Invalid Public Key"} };
    // VALIDATE private key
    const isValidPrivateKey = ValidationUtils.isValidPrivateKey(transactionData.senderPrivKey);
    if (!isValidPrivateKey) { return { errorMsg: "Invalid Private Key"} };
    // VALIDATE "value"
    const isValidTransferValue = ValidationUtils.isValidTransferValue(transactionData.value);
    if (!isValidTransferValue) { return { errorMsg: "Invalid transfer value"} };
    // VALIDATE fee
    const isValidTransferFee = ValidationUtils.isValidTransferFee(transactionData.fee);
    if (!isValidTransferFee) { return { errorMsg: "Invalid transfer fee"} };
    // CHECKS sender account balance >= "value" + "fee" 

    let date = new Date();
    // Create newTransaction params (to, value, fee, dateCreated, data, senderPubKey, senderPrivKey)
    const newTransaction = new Transaction(
        transactionData.to,
        transactionData.value,
        transactionData.fee,
        date.toISOString(),
        transactionData.data,
        transactionData.senderPubKey,
        transactionData.senderPrivKey
    );

    // Validate and Verify signature
    const isValidSignature = ValidationUtils.isValidSignature(newTransaction.senderSignature);
    if (!isValidSignature) return { errorMsg: "Invalid Signature" };
    if (!Transaction.verifySignature()) {
        return { errorMsg: `Invalid signature: ${newTransaction.senderSignature}` };
    }

    const newTransactionDataJSON = JSON.stringify(newTransaction);
    newTransaction.transactionDataHash = CryptoHashUtils.sha256(newTransactionDataJSON).toString();

    // CHECKS for collisions -> skip duplicated transactions
    const checkForCollisions = this.findTransactionByDataHash(newTransaction.transactionDataHash);
    if (checkForCollisions) {
        return { errorMsg: `Duplicate transaction: ${newTransaction.transactionDataHash}`};
    }

    // ADD TRANSACTION to pending transactions pool 
    this.pendingTransactions.push(newTransaction);

    return newTransaction;
};

// Blockchain.prototype.addNewTransactionToPendingTransactions = function(transactionObject) {
    
// };


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