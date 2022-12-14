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

// TRANSACTIONS ===========================================================
// ========================================================================
Blockchain.prototype.addNewTransactionToPendingTransactions = function(transactionObject) {
    // ADD TRANSACTION to pending transactions pool 
    this.pendingTransactions.push(transactionObject);
    // Return index of the next block for transaction to be assigned to
    return this.getLastBlockOnChain().index + 1;
};


Blockchain.prototype.getPendingTransactions = function() {
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

Blockchain.prototype.getAllTransactions = function() {
    let transactions = this.getConfirmedTransactions();
    transactions.push.apply(transactions, this.pendingTransactions);
    return transactions;
}

Blockchain.prototype.findTransactionByDataHash = function(hash) {
    const allTransactions = this.getAllTransactions();
    let targetTransaction = allTransactions.filter((transaction) => 
    transaction.transactionDataHash === hash);
    // console.log("findTransactionByDataHash", targetTransaction[0]);
    return targetTransaction[0];
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

    // Parse to JSON and Create Transaction Data Hash
    // const newTransactionDataJSON = JSON.stringify(newTransaction);
    // const transactionDataHash = CryptoHashUtils.sha256(newTransactionDataJSON).toString();
     

    // Validate and Verify signature
    const isValidSignature = ValidationUtils.isValidSignature(newTransaction.senderSignature);
    if (!isValidSignature) return { errorMsg: "Invalid Signature" };
    if (!newTransaction.verifySignature()) {
        console.log("VErify SIG ", newTransaction.verifySignature());
        console.log(newTransaction);
        return { errorMsg: `Invalid signature: ${newTransaction.senderSignature}` };
    }

    // CHECKS for collisions -> skip duplicated transactions
    const transactionDataHash = newTransaction.transactionDataHash;
    const checkForCollisions = this.findTransactionByDataHash(transactionDataHash);
    if (checkForCollisions) {
        return { errorMsg: `Duplicate transaction: ${transactionDataHash}`};
    }

    return newTransaction;
};

Blockchain.prototype.getAllBalances = function() {
    const confirmedTransactions = this.getConfirmedTransactions();
    let balances = {};
    confirmedTransactions.forEach(transfer => {
        let fromAccount = transfer.from;
        let toAccount = transfer.to;

        balances[fromAccount] = balances[fromAccount] || 0; // {"sender address": current val or 0}
        balances[fromAccount] -= transfer.fee; // subtract fee from sender

        balances[toAccount] = balances[toAccount] || 0; // {"recipient address": current val or 0}

        if (transfer.transferSuccessful) {
            balances[fromAccount] -= transfer.value; // subtract value amount from sender
            balances[toAccount] += transfer.value; // add value amount to recipient

            // Remove any accounts with a zero balance
            if(balances[fromAccount] === 0) delete balances[fromAccount];
            if(balances[toAccount] === 0) delete balances[toAccount];
        }

    });

    return balances;
};

Blockchain.prototype.getAddressTransactionHistory = function(address) {
    const allTransactions = this.getAllTransactions();
    let targetedAddressTransactions = allTransactions.filter((transaction) => 
    transaction.from === address || transaction.to === address);
    // Sort the transactions
    targetedAddressTransactions.sort((a, b) => a.dateCreated.localeCompare(b.dateCreated));

    return targetedAddressTransactions;
}

Blockchain.prototype.getBalancesForAddress = function(address) {
    // The address balance is calculated by iterating over all transactions
    // For each block and for each successful transaction for the specified address:
    // 1. Match the confirmations count
    // 2. Sum the values received
    // 3. Subtract values spent + fees
    // *********** 3 TYPES OF BALANCES PER ADDRESS *********************
    // SAFE BALANCE = 6 or more confirmations TODO:
    // CONFIRMED BALANCE = 1 or more confirmations
    // PENDING BALANCE = expected balance (0 confirmations) TODO:
    let allConfirmedTrans = this.getConfirmedTransactions();
    let allPendingTrans = this.getPendingTransactions();

    function getAddressBalances(address, transactions) {
        let addressHistory = transactions.filter(transaction => transaction.to === address || transaction.from === address);

        let balance = 0;
        addressHistory.forEach(transfer => {
            if (transfer.from === address) {
                balance -= transfer.value;
                balance -= transfer.fee;
            } else if (transfer.to === address) {
                balance += transfer.value;
            }
        });

        return balance;
    }

    const confirmedTotalBalance = getAddressBalances(address, allConfirmedTrans);
    const pendingTotalBalance = getAddressBalances(address, allPendingTrans);

    console.log("confirmedTotalBalance", confirmedTotalBalance);
    console.log("pendingTotalBalance", pendingTotalBalance);
    
    return { 
        address,
        confirmedTotalBalance,
        pendingTotalBalance
    };
}


// MINING =============================================================================
// ====================================================================================





// PEER NODE DATA =====================================================================
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
        && this.pendingTransactions.length === 0
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