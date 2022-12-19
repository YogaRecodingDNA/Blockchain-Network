const Block = require("./Block");
const Transaction = require("./Transaction");
const ValidationUtils = require("./utils/ValidationUtils");
const Config = require("./utils/Config");
var cloneDeep = require('lodash.clonedeep');

// ********************************************************************************
// ************************* BLOCKCHAIN CONSTRUCTOR *******************************
// ********************************************************************************
function Blockchain() {
    this.blocks = [Block.genesisBlock()]; // Array of blocks in the chain
    this.pendingTransactions = []; // array of pending transactions
    this.networkNodes = new Map(); // Array of nodes in the network
    if(this.networkNodes.size === 0) {
        this.networkNodes.set(Config.currentNodeId, Config.currentNodeURL);
    }
    this.currentNodeURL = Config.currentNodeURL; // URL
    this.currentDifficulty = Config.initialDifficulty; // Integer of number of leading zeros
    this.miningJobs = {}; // A map map(blockDataHash -> Block) of blocks mined by this network node
    console.log("BLOCKS", this.blocks);
    console.log("PENDING TRANSACTIONS", this.pendingTransactions);
}


// -----------------------------------------------------------------------------------
// --------------------- CALCULATE CUMULATIVE DIFFICULTY -----------------------------
// -----------------------------------------------------------------------------------
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


// -----------------------------------------------------------------------------------
// ---------------------- GET LAST BLOCK ON THE BLOCKCHAIN ---------------------------
// -----------------------------------------------------------------------------------
Blockchain.prototype.getLastBlockOnChain = function() {
    return this.blocks[this.blocks.length - 1];
};


// ***********************************************************************************
// ******************************** TRANSACTIONS *************************************
// ***********************************************************************************
// -----------------------------------------------------------------------------------
// ------------------------- GET CONFIRMED TRANSACTIONS ------------------------------
// -----------------------------------------------------------------------------------
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


// -----------------------------------------------------------------------------------
// ----------------------------- GET ALL TRANSACTIONS --------------------------------
// -----------------------------------------------------------------------------------
Blockchain.prototype.getAllTransactions = function() {
    let transactions = this.getConfirmedTransactions();
    transactions.push.apply(transactions, this.pendingTransactions);

    return transactions;
}


// -----------------------------------------------------------------------------------
// ------------------------- FIND TRANSACTION BY DATA HASH ---------------------------
// -----------------------------------------------------------------------------------
Blockchain.prototype.findTransactionByDataHash = function(hash) {
    const allTransactions = this.getAllTransactions();
    let targetTransaction = allTransactions.filter((transaction) => 
    transaction.transactionDataHash === hash);

    return targetTransaction[0];
}


// -----------------------------------------------------------------------------------
// --------------------------- CREATE NEW TRANSACTION --------------------------------
// -----------------------------------------------------------------------------------
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
    // VALIDATE value
    const isValidTransferValue = ValidationUtils.isValidTransferValue(transactionData.value);
    if (!isValidTransferValue) { return { errorMsg: "Invalid transfer value"} };
    // VALIDATE fee
    const isValidTransferFee = ValidationUtils.isValidTransferFee(transactionData.fee);
    if (!isValidTransferFee) { return { errorMsg: "Invalid transfer fee"} };
    // CHECKS that sender account balance >= "value" + "fee"
    const sender = transactionData.from;
    const senderBalances = this.getBalancesForAddress(sender);
    if (senderBalances.confirmedBalance < transactionData.value + transactionData.fee ) {
        return { errorMsg: `Insufficient funds from sender's address ${sender}`};
    }

    // Create newTransaction params (to, value, fee, dateCreated, data, senderPubKey, senderPrivKey)
    const newTransaction = new Transaction(
        transactionData.to,
        transactionData.value,
        transactionData.fee,
        new Date().toISOString(),
        transactionData.data,
        transactionData.senderPubKey,
        transactionData.senderPrivKey
    );

    // Validate and Verify signature
    try {
        const isValidSignature = ValidationUtils.isValidSignature(newTransaction.senderSignature);
        if (!isValidSignature) return { errorMsg: "Invalid Signature" };
        
        if (!newTransaction.verifySignature()) {
            console.log("VERIFY SIG ", newTransaction.verifySignature());
            console.log(newTransaction);
            return { errorMsg: `Invalid signature: ${newTransaction.senderSignature}` };
        }
    } catch (error) {
        res.json({ catchError: error });
    }

    // Checks for collisions -> skip duplicated transactions
    const transactionDataHash = newTransaction.transactionDataHash;
    const checkForCollisions = this.findTransactionByDataHash(transactionDataHash);
    if (checkForCollisions) {
        return { errorMsg: `Duplicate transaction: ${transactionDataHash}`};
    }

    return newTransaction;
};


// -----------------------------------------------------------------------------------
// ---------------- ADD NEW TRANSACTION TO PENDING TRANSACTIONS ----------------------
// -----------------------------------------------------------------------------------
Blockchain.prototype.addNewTransactionToPendingTransactions = function(transactionObject) {
    this.pendingTransactions.push(transactionObject); // Add to pending transactions pool 
    return this.getLastBlockOnChain().index + 1; // Return index of the next block on blockchain
};


// -----------------------------------------------------------------------------------
// ----------------------- GET ALL PENDING TRANSACTIONS ------------------------------
// -----------------------------------------------------------------------------------
Blockchain.prototype.getPendingTransactions = function() {
    return this.pendingTransactions;
}


// -----------------------------------------------------------------------------------
// ----------------------- REMOVE PENDING TRANSACTIONS -------------------------------
// -----------------------------------------------------------------------------------
Blockchain.prototype.removePendingTransactions = function(transactionsToRemove) {
    let transactionHashesToRemove = new Set();

    // Add to the Set() -> the data hashes of transactions to be removed
    for (let transaction of transactionsToRemove) {
        transactionHashesToRemove.add(transaction.transactionDataHash);
    }

    // Update transaction pool with valid list (pendingTransactions)
    this.pendingTransactions = this.pendingTransactions.filter(
        transaction => !transactionHashesToRemove.has(transaction.transactionDataHash));
}

// -----------------------------------------------------------------------------------
// ---------------------- GET ADDRESS TRANSACTION HISTORY ----------------------------
// -----------------------------------------------------------------------------------
Blockchain.prototype.getAddressTransactionHistory = function(address) {
    if (!ValidationUtils.isValidAddress(address)) return { errorMsg: "Invalid address"};

    const allTransactions = this.getAllTransactions();
    let targetedAddressTransactions = allTransactions.filter((transaction) => 
    transaction.from === address || transaction.to === address);
    // Sort the transactions by date
    targetedAddressTransactions.sort((a, b) => a.dateCreated.localeCompare(b.dateCreated));

    return targetedAddressTransactions;
}

// -----------------------------------------------------------------------------------
// ---------------------------- GET ADDRESS BALANCES ---------------------------------
// -----------------------------------------------------------------------------------
Blockchain.prototype.getBalancesForAddress = function(address) {
    if (!ValidationUtils.isValidAddress(address)) return { errorMsg: "Invalid address"};

    let balance = {
        safeBalance: 0,       // 6 or more confirmations
        confirmedBalance: 0,  // 1 or more confirmations
        pendingBalance: 0     // expected balance (0 confirmations)
    }

    const transactionHistory = this.getAddressTransactionHistory(address);

    for (let transaction of transactionHistory) {
        let confirmationsCount = 0;
        if (transaction.minedInBlockIndex) {// Match the confirmations count
            confirmationsCount = this.blocks.length - transaction.minedInBlockIndex + 1;
        }
       
        if (transaction.to === address) { // Sum the values received
            if (confirmationsCount >= Config.safeConfirmations && transaction.transferSuccessful) {
                balance.safeBalance += transaction.value;
            }

            if (confirmationsCount >= 1 && transaction.transferSuccessful) {
                balance.confirmedBalance += transaction.value;
            }

            if (confirmationsCount === 0 || transaction.transferSuccessful) {
                balance.pendingBalance += transaction.value;
            }
        }
        
        if (transaction.from === address) {
            // Subtract "fee" for "all" spent txs / Subtract "value" for "successful" spent txs
            balance.pendingBalance -= transaction.fee;
            if (confirmationsCount === 0 || transaction.transferSuccessful) {
                balance.pendingBalance -= transaction.value;
            }

            if(confirmationsCount >= Config.safeConfirmations) {
                balance.confirmedBalance -= transaction.fee;
                if(transaction.transferSuccessful) {
                    balance.confirmedBalance -= value;
                }
            }

            if (confirmationsCount >= 1 && transferSuccessful) {
                balance.safeBalance -= fee;
                if(transaction.transferSuccessful) {
                    balance.safeBalance -= value;
                }
            }
        }

    }
    return balance;
}

// -----------------------------------------------------------------------------------
// ------------------------------ GET ALL BALANCES -----------------------------------
// -----------------------------------------------------------------------------------
Blockchain.prototype.getAllBalances = function() {
    const confirmedTransactions = this.getConfirmedTransactions();
    let balances = {};
    confirmedTransactions.forEach(transfer => {
        let fromAccount = transfer.from;
        let toAccount = transfer.to;

        balances[fromAccount] = balances[fromAccount] || 0; // {"sender address": current val or 0}
        balances[fromAccount] -= transfer.fee;              // subtract fee from sender

        balances[toAccount] = balances[toAccount] || 0;   // {"recipient address": current val or 0}

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


// ***********************************************************************************
// ********************************* MINING ******************************************
// ***********************************************************************************
// -----------------------------------------------------------------------------------
// ----------------------------- MINE NEW BLOCK --------------------------------------
// -----------------------------------------------------------------------------------
Blockchain.prototype.mineNewBlock = function(minerAddress, difficulty) {
    // PROOF OF WORK
    let blockCandidate = this.prepareBlockCandidate(minerAddress, difficulty);
    blockCandidate.calculateBlockHash();
    console.log(("0").repeat(difficulty));

    while(blockCandidate.blockHash.substring(0, difficulty) !== ("0").repeat(difficulty)) {
        console.log(blockCandidate.nonce);
        blockCandidate.nonce++;
        blockCandidate.dateCreated = new Date().toISOString();
        blockCandidate.calculateBlockHash();
        console.log(blockCandidate.blockHash);
    }

    const newBlock = this.submitMinedBlockToNode(
        blockCandidate.blockDataHash,
        blockCandidate.dateCreated,
        blockCandidate.nonce,
        blockCandidate.blockHash,
        difficulty
    );

    return newBlock;
};

// ------------------------------------------------------------------------------------
// ------------------- PREPARE THE BLOCK CANDIDATE FOR MINING -------------------------
// ------------------------------------------------------------------------------------
Blockchain.prototype.prepareBlockCandidate = function(minerAddress, difficulty) {
    let balances = this.getAllBalances();
    let blockReward = Config.blockReward;
    let newBlockIndex = this.blocks.length;
    // let transactions = this.getPendingTransactions();

    // 1. Deep clone pending transactions & Sort descending by fee
    let transactions = cloneDeep(this.getPendingTransactions());
    transactions.sort((a, b) => b.fee - a.fee);

    // 2. Transfer all pending transactions' fees
    // 3. Execute all the transactions
    for (let transaction of transactions) {
        let asSender = transaction.from;
        let asRecipient = transaction.to;

        balances[asSender] = balances[asSender] || 0;
        balances[asRecipient] = balances[asRecipient] || 0;

        if (balances[asSender] >= transaction.fee) {
            transaction.minedInBlockIndex = newBlockIndex;

            // Transaction sender pays processing fee
            balances[asSender] -= transaction.fee;
            blockReward += transaction.fee; // adds to blockReward

            // Execute the transfer from sender -> recipient (validate balance)
            if(balances[asSender] >= transaction.value) {
                balances[asSender] -= transaction.value;
                balances[asRecipient] += transaction.value;

                transaction.transferSuccessful = true;
            } else {
                transaction.transferSuccessful = false;
            }
        } else {
            // Insufficient balance to pay the transaction fee
            // Transaction cannot be mined
            // Drop txn from pendingTxns and this txn list
            this.removePendingTransactions([transaction]);
            transactions = transactions.filter(txn => txn !== transaction);
        }
    }

    // 4. Create coinbase transaction collects/transfers all tx fees + block reward
    const coinbaseTransaction = new Transaction(
        minerAddress,             // to: address
        blockReward,              // value: miner's reward
        0,                        // fee: mining fee
        new Date().toISOString(), // dateCreated: ISO format
        "coinbase tx",            // data: payload / comments
        undefined,                // senderPubKey: 
        undefined                 // senderPrivKey:
    );

    // 5. Prepend the coinbase txn with updated (reward + fees) to txn list
    transactions.unshift(coinbaseTransaction);

    // 6. Prepare the new block candidate
    const newBlockCandidate = new Block(
        this.blocks.length,                            // block index
        transactions,                                  // validated/updated transactions
        difficulty,                                    // difficulty
        this.blocks[this.blocks.length - 1].blockHash, // previous block hash
        minerAddress,                                  // mined by
        0,                                             // nonce
        new Date().toISOString()                       // timestamp of now
    );

    // 7. Set to blockchain's map of block candidates for mining pool
    this.miningJobs[newBlockCandidate.blockDataHash] = newBlockCandidate;

    return newBlockCandidate;
}


// ----------------------------------------------------------------------------------
// ---------------------- SUBMIT MINED BLOCK TO NODE --------------------------------
// ----------------------------------------------------------------------------------
Blockchain.prototype.submitMinedBlockToNode = function(blockDataHash, dateCreated, nonce, blockHash, difficulty) {
    // Get targeted block candidate by hash
    let newBlock = this.miningJobs[blockDataHash];
    if (!newBlock) return { errorMsg: "Block not found or already mined" };
    
    newBlock.dateCreated = dateCreated;
    newBlock.nonce = nonce;
    newBlock.calculateBlockHash();
    
    if (newBlock.blockHash !== blockHash) return { errorMsg: "Incorrect block hash calculation"};
    if (newBlock.blockHash.substring(0, difficulty).length !== newBlock.difficulty) {
        return { errorMsg: "Block hash does not match the block difficulty"};
    }
    
    newBlock = this.addMinedBlockToChain(newBlock);

    return newBlock;
}

// ----------------------------------------------------------------------------------
// ----------- ADD MINED BLOCK TO THE CHAIN / EXTEND THE BLOCKCHAIN -----------------
// ----------------------------------------------------------------------------------
Blockchain.prototype.addMinedBlockToChain = function(newBlock) {
    // New Block Validation
    if (newBlock.index !== this.blocks.length) return { errorMsg: "Block already mined by another"};

    const previousBlock = this.blocks[this.blocks.length - 1];
    const previousBlockHash = previousBlock.blockHash;
    if (previousBlockHash !== newBlock.prevBlockHash) {
        return { errorMsg: "Incorrect previous block hash"};
    }

    // Add new block
    this.blocks.push(newBlock);
    // Remove all other mining jobs for new block
    this.miningJobs = {};
    // Remove new block's transactions from transaction pool
    this.removePendingTransactions(newBlock.transactions);

    return newBlock;
}


// ********************************************************************************
// ************************ PEERS / SYNCHRONIZATION *******************************
// ********************************************************************************
// --------------------------------------------------------------------------------
// ---------------------------- GET PEER DATA -------------------------------------
// --------------------------------------------------------------------------------
Blockchain.prototype.getPeersData = function() {
    const peers = this.networkNodes.entries();

    let peerObj = {};
    for (const [key, value] of peers) {
        peerObj[`${key}`] = value;
    }
    console.log("THIS NODE URL ==> ", this.networkNodes.get(Config.currentNodeId));
    return peerObj;
};


// // --------------------------------------------------------------------------------
// // --------------------------- CONNECTING PEERS -----------------------------------
// // --------------------------------------------------------------------------------
// Blockchain.prototype.connectToPeers = function(peer) {

// }



// --------------------------------------------------------------------------------
// -------------------------- RESET THE BLOCKCHAIN --------------------------------
// --------------------------------------------------------------------------------
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


module.exports = Blockchain;