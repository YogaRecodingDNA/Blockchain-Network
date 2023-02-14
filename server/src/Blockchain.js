const Config = require("./utils/Config");
const Block = require("./Block");
const Transaction = require("./Transaction");
const ValidationUtils = require("./utils/ValidationUtils");
const CryptoHashUtils = require("./utils/CryptoHashUtils");
var cloneDeep = require('lodash.clonedeep');
const { default: axios } = require("axios");


// ***********************************************************************************
// ***********************************************************************************
// ***************************** BLOCKCHAIN / BLOCKS *********************************
// ***********************************************************************************
// ***********************************************************************************

// -----------------------------------------------------------------------------------
// --------------------------- BLOCKCHAIN CONSTRUCTOR --------------------------------
// -----------------------------------------------------------------------------------
function Blockchain() {
    this.blocks = Block.genesisBlock(); // Array of blocks in the chain
    this.pendingTransactions = []; // Array of pending transactions
    this.networkNodes = new Map(); // MAP of peer nodes in the network
    if(this.networkNodes.size === 0) {
        this.networkNodes.set(Config.currentNodeId, Config.currentNodeURL);
    }
    this.currentNodeURL = Config.currentNodeURL; // This node's URL
    this.currentDifficulty = Config.initialDifficulty; // Integer -> number of leading zeros
    this.miningJobs = {}; // MAP of unmined blocks -> new Map(blockDataHash -> Block)
}

// -----------------------------------------------------------------------------------
// --------------------------- {{{VALIDATE}}} BLOCK ----------------------------------
// -----------------------------------------------------------------------------------
Blockchain.prototype.validateBlock = function(peerBlock) {
    // CHECKS for missing property fields keys
    const missingFields = ValidationUtils.isMissing_FieldKeys(peerBlock);
    if (missingFields) return {  errorMsg: missingFields };

    // CHECKS for invalid property fields keys
    const invalidFields = ValidationUtils.isValid_FieldKeys(peerBlock);
    if (invalidFields) return {  errorMsg: invalidFields };

    // VALIDATE INDEX
    const previousBlockIndex = this.blocks[peerBlock.index - 1].index;
    const isValidBlockIndex = ValidationUtils.isValidBlockIndex(peerBlock.index, previousBlockIndex);
    if (!isValidBlockIndex) return { errorMsg: "Block index invalid" };

    // VALIDATE DIFFICULTY
    const isValidDifficulty = ValidationUtils.isValidDifficulty(peerBlock.difficulty);
    if (!isValidDifficulty) return { errorMsg: "Difficulty invalid" };

    // VALIDATE PREVIOUS BLOCK HASH
    const previousBlockHash = this.blocks[peerBlock.index - 1].blockHash;
    if (peerBlock.prevBlockHash !== previousBlockHash) return { errorMsg: "Previous block hash does not match" };

    // VALIDATE BLOCK DATA HASH
    const recalculatedBlockDataHash = CryptoHashUtils.calcBlockDataHash(
        peerBlock.index,
        peerBlock.transactions,
        peerBlock.difficulty,
        peerBlock.prevBlockHash,
        peerBlock.minedBy
    );

    if (peerBlock.blockDataHash !== recalculatedBlockDataHash) return { errorMsg: "Invalid block data hash" };

    // VALIDATE NONCE
    const isValidNonce = ValidationUtils.isValidNonce(peerBlock.nonce);
    if (!isValidNonce) return { errorMsg: "Invalid nonce" };

    // VALIDATE DATE CREATED
    const isValidDate = ValidationUtils.isValidDate(peerBlock.dateCreated);
    if (!isValidDate) return { errorMsg: "Invalid date" };

    // VALIDATE BLOCK HASH
    const recalculatedBlockHash = CryptoHashUtils.sha256(
        peerBlock.blockDataHash + peerBlock.nonce + peerBlock.dateCreated).toString();
    if (peerBlock.blockHash !== recalculatedBlockHash) return { errorMsg: "Invalid block hash" };


    // VALIDATE TRANSACTIONS & DATA, AND RE-EXECUTE TRANSFERS
    const transactions = peerBlock.transactions;
    transactions.forEach(transaction => {
        const isValidTransaction = this.validateTransaction(transaction);
        
        if (isValidTransaction.errorMsg) {
            return { errorMsg: isValidTransaction.errorMsg + `in Block ${transaction.minedInBlockIndex} for transaction: ${transaction.transactionDataHash}` };
        }
        
        let balances = this.getAllBalances();
        let newBlockIndex = this.blocks.length;
        
        let asSender = transaction.from;
        let asRecipient = transaction.to;
        
        balances[asSender] = balances[asSender] || 0;
        balances[asRecipient] = balances[asRecipient] || 0;
        
        if (balances[asSender] >= transaction.fee) {
            transaction.minedInBlockIndex = newBlockIndex;
            
            // Transaction sender pays processing fee
            balances[asSender] -= transaction.fee;
            
            // Execute the transfer from sender -> recipient (validate balance)
            if(balances[asSender] >= transaction.value) {
                balances[asSender] -= transaction.value;
                balances[asRecipient] += transaction.value;
                
                transaction.transferSuccessful = true;
            } else {
                transaction.transferSuccessful = false;
            }
        }
    })
    
    return true;
}

// -----------------------------------------------------------------------------------
// -------------------- {{{GET LAST}}} BLOCK ON THE BLOCKCHAIN -----------------------
// -----------------------------------------------------------------------------------
Blockchain.prototype.getLastBlockOnChain = function() {
    return this.blocks.length - 1;
};

// --------------------------------------------------------------------------------
// ------------------------ {{{RESET}}} THE BLOCKCHAIN ----------------------------
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

// -----------------------------------------------------------------------------------
// ----------------------- CALCULATE CUMULATIVE DIFFICULTY ---------------------------
// -----------------------------------------------------------------------------------
Blockchain.prototype.calculateCumulativeDifficulty = function() {
    let difficulty = 0;
    for (let block of this.blocks) {
        difficulty += 16 ** block.difficulty;
    }
    return difficulty;
};




// ***********************************************************************************
// ***********************************************************************************
// ******************************** TRANSACTIONS *************************************
// ***********************************************************************************
// ***********************************************************************************

// -----------------------------------------------------------------------------------
// ----------------------- {{{GET CONFIRMED}}} TRANSACTIONS --------------------------
// -----------------------------------------------------------------------------------
Blockchain.prototype.getConfirmedTransactions = function() {
    let confirmedTransactions = [];
    for (let block of this.blocks) {
        confirmedTransactions.push.apply(confirmedTransactions, block.transactions);
    }
    return confirmedTransactions;
};

// -----------------------------------------------------------------------------------
// -------------------------- {{{GET ALL}}} TRANSACTIONS -----------------------------
// -----------------------------------------------------------------------------------
Blockchain.prototype.getAllTransactions = function() {
    let transactions = this.getConfirmedTransactions();
    transactions.push.apply(transactions, this.pendingTransactions);

    return transactions;
}

// -----------------------------------------------------------------------------------
// --------------------- {{{FIND}}} TRANSACTION BY DATA HASH -------------------------
// -----------------------------------------------------------------------------------
Blockchain.prototype.findTransactionByDataHash = function(hash) {
    const allTransactions = this.getAllTransactions();
    let targetTransaction = allTransactions.filter((transaction) => 
    transaction.transactionDataHash === hash);

    return targetTransaction[0];
}

// -----------------------------------------------------------------------------------
// ------------------------- {{{VALIDATE}}} TRANSACTION ------------------------------
// -----------------------------------------------------------------------------------
Blockchain.prototype.validateTransaction = function(transactionData) {
    // ******* TO VALIDATE BOTH *********
    // 1. ALREADY EXISTING TRANSACTIONS OR..
    // 2. THE INPUT DATA PRIOR TO NEW TRANSACTION CREATION

    // CHECKS for missing property fields keys
    const missingFields = ValidationUtils.isMissing_FieldKeys(transactionData);
    if (missingFields) return {  errorMsg: missingFields };

    // CHECKS for invalid property fields keys
    const invalidFields = ValidationUtils.isValid_FieldKeys(transactionData);
    if (invalidFields) return {  errorMsg: invalidFields };

    // VALIDATE recipient address
    const isValidRecipient = ValidationUtils.isValidAddress(transactionData.to);
    if (!isValidRecipient) return { errorMsg: "Invalid Recipient Address" };

    // VALIDATE value
    const isValidTransferValue = ValidationUtils.isValidTransferValue(transactionData.value);
    if (!isValidTransferValue) return { errorMsg: "Invalid transfer value" };

    // VALIDATE fee
    const isValidTransferFee = ValidationUtils.isValidTransferFee(transactionData.fee);
    if (!isValidTransferFee) return { errorMsg: "Invalid transfer fee" };
    
    // VALIDATE public key
    const isValidPublicKey = ValidationUtils.isValidPublicKey(transactionData.senderPubKey);
    if (!isValidPublicKey) return { errorMsg: "Invalid Public Key" };

    // **** SPECIFIC ONLY TO EXISTING TRANSACTIONS *****
    if (transactionData.transactionDataHash) {
        // VALIDATE TRANSACTION DATA HASH
        const recalculatedDataHash = CryptoHashUtils.calcTransactionDataHash(
            transactionData.from,
            transactionData.to,
            transactionData.value,
            transactionData.fee,
            transactionData.dateCreated,
            transactionData.data,
            transactionData.senderPubKey
        );

        if (transactionData.transactionDataHash !== recalculatedDataHash) {
            return { errorMsg: "Invalid data hash" };
        }

        // VALIDATE sender address
        const isValidSender = ValidationUtils.isValidAddress(transactionData.from);
        if (!isValidSender) return { errorMsg: "Invalid Sender Address" };

        // VALIDATE and Verify signature
        const signature = transactionData.senderSignature;
        const isValidSignature = ValidationUtils.isValidSignature(signature);
        if (!isValidSignature) return { errorMsg: "Invalid Signature" };
        
        if (!CryptoHashUtils.verifySignature(
            transactionData.transactionDataHash,
            transactionData.senderPubKey,
            transactionData.senderSignature
            )) {
            return { errorMsg: `Signature failed verification: ${signature}` };
        }

        // CHECK FOR COLLISIONS -> skip duplicated transactions
        const transactionDataHash = transactionData.transactionDataHash;
        const checkForCollisions = this.findTransactionByDataHash(transactionDataHash);
        if (checkForCollisions) {
            return { errorMsg: `Duplicate transaction: ${transactionDataHash}`};
        }
    }

    return true;
}

// -----------------------------------------------------------------------------------
// ------------------------ {{{CREATE NEW}}} TRANSACTION -----------------------------
// -----------------------------------------------------------------------------------
Blockchain.prototype.createNewTransaction = function(transactionData) {
    
    const isValidTransaction = this.validateTransaction(transactionData);
    if (isValidTransaction.errorMsg) return isValidTransaction;
    
    // Create newTransaction params (from, to, value, fee, dateCreated, data, senderPubKey, senderPrivKey, senderSignature)
    const newTransaction = new Transaction(
        transactionData.from,
        transactionData.to,
        transactionData.value,
        transactionData.fee,
        transactionData.dateCreated,
        transactionData.data,
        transactionData.senderPubKey,
        transactionData.transactionDataHash,
        transactionData.senderPrivKey,          // (FOR TESTING ONLY)
        transactionData.senderSignature,
        );
        
    const isValidNewTransaction = this.validateTransaction(newTransaction);
    if (isValidNewTransaction.errorMsg) return isValidNewTransaction;

    return newTransaction;
};

// -----------------------------------------------------------------------------------
// ---------------- {{{ADD NEW}}} TRANSACTION TO PENDING TRANSACTIONS ----------------
// -----------------------------------------------------------------------------------
Blockchain.prototype.addNewTransactionToPendingTransactions = function(transactionObject) {
    this.pendingTransactions.push(transactionObject); // Add to pending transactions pool 

    return this.getLastBlockOnChain().index + 1; // Return index of the next block on blockchain
};

// -----------------------------------------------------------------------------------
// ---------------------- {{{GET ALL PENDING}}} TRANSACTIONS -------------------------
// -----------------------------------------------------------------------------------
Blockchain.prototype.getPendingTransactions = function() {
    return this.pendingTransactions;
};

// -----------------------------------------------------------------------------------
// ------------------- {{{GET HISTORY}}} OF ADDRESS TRANSACTIONS ---------------------
// -----------------------------------------------------------------------------------
Blockchain.prototype.getAddressTransactionHistory = function(address) {
    if (!ValidationUtils.isValidAddress(address)) return { errorMsg: "Invalid address"};

    const allTransactions = this.getAllTransactions();
    let targetedAddressTransactions = allTransactions.filter((transaction) => 
    transaction.from === address || transaction.to === address);
    // Sort the transactions by date
    targetedAddressTransactions.sort((a, b) => a.dateCreated.localeCompare(b.dateCreated));

    return targetedAddressTransactions;
};

// -----------------------------------------------------------------------------------
// ---------------------- {{{REMOVE}}} PENDING TRANSACTIONS --------------------------
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
};




// ***********************************************************************************
// ***********************************************************************************
// ********************************* BALANCES ****************************************
// ***********************************************************************************
// ***********************************************************************************

// -----------------------------------------------------------------------------------
// ---------------------------- {{{GET ALL}}} BALANCES -------------------------------
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

// -----------------------------------------------------------------------------------
// ------------------------- {{{GET ADDRESS}}} BALANCES ------------------------------
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
                    balance.confirmedBalance -= transaction.value;
                }
            }

            if (confirmationsCount >= 1 && transaction.transferSuccessful) {
                balance.safeBalance -= transaction.fee;
                if(transaction.transferSuccessful) {
                    balance.safeBalance -= transaction.value;
                }
            }
        }
    }
    return balance;
};





// ***********************************************************************************
// ***********************************************************************************
// ********************************* MINING ******************************************
// ***********************************************************************************
// ***********************************************************************************

// -----------------------------------------------------------------------------------
// -------------------------- {{{MINE}}} NEW BLOCK -----------------------------------
// -----------------------------------------------------------------------------------
Blockchain.prototype.mineNewBlock = function(minerAddress) {
    let difficulty = (this.currentDifficulty - 3); // temporary number for testing
    // const minimumDifficulty = 4;

    let blockCandidate = this.prepareBlockCandidate(minerAddress, difficulty);
    blockCandidate.calculateBlockHash();
    
    // PROOF OF WORK
    while(blockCandidate.blockHash.substring(0, difficulty) !== ("0").repeat(difficulty)) {
        // While the amount of leading zeros doesn't match the difficulty, recalculate block hash
        blockCandidate.nonce++;
        // blockCandidate.difficulty = difficulty;
        blockCandidate.dateCreated = new Date().toISOString();
        blockCandidate.calculateBlockHash();
        
        console.log(blockCandidate.blockHash);
        console.log("DIFFICULTY ====> ", difficulty);
        console.log("NONCE =========> ", blockCandidate.nonce);
    }

    // SUBMIT MINED BLOCK
    const newBlock = this.submitMinedBlockToNode(
        blockCandidate.blockDataHash,
        blockCandidate.dateCreated,
        blockCandidate.nonce,
        blockCandidate.blockHash,
        blockCandidate.difficulty
    );

    return newBlock;
};

// ------------------------------------------------------------------------------------
// ------------------- {{{PREPARE BLOCK CANDIDATE}}} FOR MINING -----------------------
// ------------------------------------------------------------------------------------
// 1. Deep clone pending transactions
// 2. Transfer all pending transactions' fees
// 3. Execute all the transactions
// 4. Create coinbase transaction collecting and transfering all transaction fees + block reward
// 5. Add the coinbase transaction to the transaction list
// 6. Prepare the new block candidate
// 7. Add new block candidate to mining pool to be mined
Blockchain.prototype.prepareBlockCandidate = function(minerAddress, difficulty) {
    let balances = this.getAllBalances();
    let blockReward = Config.blockReward;
    let newBlockIndex = this.blocks.length;

    // 1. Deep clone pending transactions & Sort descending by fee
    let transactions = cloneDeep(this.getPendingTransactions());
    transactions.sort((a, b) => b.fee - a.fee);

    for (let transaction of transactions) {
        let asSender = transaction.from;
        let asRecipient = transaction.to;

        balances[asSender] = balances[asSender] || 0;
        balances[asRecipient] = balances[asRecipient] || 0;

        if (balances[asSender] >= transaction.fee) {
            transaction.minedInBlockIndex = newBlockIndex;

            // 2. Transfer all pending transactions' fees
            balances[asSender] -= transaction.fee; // Transaction sender pays processing fee
            blockReward += transaction.fee; // adds to blockReward

            // 3. Execute all the transactions
            if(balances[asSender] >= transaction.value) { // validate sufficient balance
                // Execute the transfer from sender -> recipient
                balances[asSender] -= transaction.value;
                balances[asRecipient] += transaction.value;

                transaction.transferSuccessful = true;
            } else {
                transaction.transferSuccessful = false;
            }
        } else {
            // Insufficient balance | Transaction can't be mined | Drop transaction
            this.removePendingTransactions([transaction]);
            transactions = transactions.filter(txn => txn !== transaction);
        }
    }

    // 4. Create coinbase transaction collects/transfers all tx fees + block reward
    const coinbaseTransaction = new Transaction(
        undefined,                  // from: address (derived from senderPubKey)
        minerAddress,               // to: address
        blockReward,                // value: miner's reward
        0,                          // fee: mining fee
        new Date().toISOString(),   // dateCreated: ISO format
        "coinbase tx",              // data: payload / comments
        Config.nullPublicKey,       // senderPubKey
        undefined,                  // transactionDataHash (auto calculated)
        Config.nullPrivateKey,      // senderPrivKey (FOR TESTING ONLY)
        Config.nullSenderSignature  // senderSignature 
    );

    coinbaseTransaction.minedInBlockIndex = newBlockIndex;

    // 5. Prepend the coinbase txn with updated (reward + fees) to txn list
    transactions.unshift(coinbaseTransaction);

    // 6. Prepare the new block candidate
    const newBlockCandidate = new Block(
        this.blocks.length,                            // block index
        transactions,                                  // validated/updated transactions
        difficulty,                                    // difficulty
        this.blocks[this.blocks.length - 1].blockHash, // previous block hash
        minerAddress,                                  // mined by
        0,                                             // blockDataHash
        0,                                             // nonce
        new Date().toISOString(),                      // timestamp of now
        0                                              // blockHash
    );

    // 7. Set to blockchain's map of block candidates for mining pool
    this.miningJobs[newBlockCandidate.blockDataHash] = newBlockCandidate;

    return newBlockCandidate;
};

// ----------------------------------------------------------------------------------
// ---------------------- {{{SUBMIT}}} MINED BLOCK TO NODE --------------------------
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
};

// ----------------------------------------------------------------------------------
// ----------- {{{ADD MINED BLOCK}}} TO THE CHAIN / EXTEND THE BLOCKCHAIN -----------
// ----------------------------------------------------------------------------------
Blockchain.prototype.addMinedBlockToChain = function(newBlock) {
    // Validate New Block
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
};





// ********************************************************************************
// ********************************************************************************
// ************************ PEERS / SYNCHRONIZATION *******************************
// ********************************************************************************
// ********************************************************************************

// --------------------------------------------------------------------------------
// -------------------------- {{{GET PEER}}} DATA ---------------------------------
// --------------------------------------------------------------------------------
Blockchain.prototype.getPeersData = function() {
    const peers = this.networkNodes.entries();

    let peerObj = {};
    for (const [key, value] of peers) {
        peerObj[`${key}`] = value;
    }
    return peerObj;
};

// --------------------------------------------------------------------------------
// ----------------- {{{BROADCAST/REGISTER}}} NEW PEER TO NETWORK -----------------
// --------------------------------------------------------------------------------
Blockchain.prototype.registerBroadcastNewPeerToNetwork = async function(endpoints, peerNodeId, peerNodeUrl) {
    
    await Promise.all(endpoints.map(endpoint => axios.post(endpoint, { peerNodeId, peerNodeUrl }))).then(function(){}).catch(function(error){ console.log("Peer registration error", error)});
};

// --------------------------------------------------------------------------------
// ------------------ {{{REGISTER ALL NODES}}} TO PEER ----------------------------
// --------------------------------------------------------------------------------
Blockchain.prototype.registerAllNodesToPeer = async function(allPeers) {
    
    allPeers.forEach((peerUrl) => {

        axios.get(peerUrl + "/info")
        .then( data => {
            const peerInfo = data.data;
            const peers = peerInfo.peersMap;

            for (let data in peers) {
                const id = data;
                const url = peers[id];
                const peerNotPreExisting = !this.networkNodes.has(id);
                const notCurrentNode = this.currentNodeURL !== url;
                
                if (peerNotPreExisting && notCurrentNode) {
                    axios.post(this.currentNodeURL + "/peers/connect", { peerUrl: peerInfo.nodeUrl }).then(function(){}).catch(function(){});

                    return { message: "Successfully registered network nodes to new peer" };
                }
            }
        })
        .catch( error => {
            console.log("ERROR:", error);

            return { errorMsg: "Error registering network to new peer node." };
        });

    });
};

// --------------------------------------------------------------------------------
// ------------------- {{{NOTIFY PEERS}}} ABOUT NEW BLOCK -------------------------
// --------------------------------------------------------------------------------
Blockchain.prototype.notifyPeersAboutNewBlock = function() {
    const notification = {
        blocksCount: this.blocks.length,
        cumulativeDifficulty: this.cumulativeDifficulty(),
        nodeUrl: this.currentNodeURL,
    }

    this.networkNodes.forEach( (peerUrl) => {
        axios.post(peerUrl + "/peers/notify-new-block", notification)
        .then(function(){}).catch(function(){});
    })
};

// --------------------------------------------------------------------------------
// ------------------------ {{{SYNCHRONIZE}}} THE CHAIN ---------------------------
// --------------------------------------------------------------------------------
Blockchain.prototype.synchronizeTheChain = async function(peerChainInfo) {
    console.log("peerChainInfo Sync Chain", peerChainInfo);
    console.log("Cumulative Difficulty", peerChainInfo.cumulativeDifficulty);
    // CALCULATE & COMPARE CUMULATIVE DIFFICULTIES
    let currentChainCumulativeDifficulty = this.calculateCumulativeDifficulty();
    let peerChainCumulativeDifficulty = peerChainInfo.cumulativeDifficulty;
    
    // IF PEER CHAIN IS LONGER, VALIDATE AND SWITCH OVER
    if (peerChainCumulativeDifficulty > currentChainCumulativeDifficulty) {
        try {
            // Get peer blocks
            const peerChainBlocks = (await axios.get(peerChainInfo.nodeUrl + "/blocks")).data;

            // Validate
            const isValid = this.validateChain(peerChainBlocks);
            if (isValid.errorMsg) return isValid;
            
            // Recalculate cumulative difficulties
            currentChainCumulativeDifficulty = this.calculateCumulativeDifficulty();
            peerChainCumulativeDifficulty = peerChainInfo.cumulativeDifficulty;
            
            // Sync to peer if they have longer chain 
            if (peerChainCumulativeDifficulty > currentChainCumulativeDifficulty) {
                this.blocks = peerChainBlocks;
                this.miningJobs = {};
            }
            
            this.removePendingTransactions(this.getConfirmedTransactions());
            
            // NOTIFY PEERS EVERY SYNC (when new block mined or received / longer chain arrival)
            this.notifyPeersAboutNewBlock();

        } catch (error) {
            console.error(`Error synchronizing the chain: ${error}`);
            return { errorMsg: error.message }
        };
    }
};

// --------------------------------------------------------------------------------
// ------------------------- {{{VALIDATE}}} CHAIN ---------------------------------
// --------------------------------------------------------------------------------
Blockchain.prototype.validateChain = function(peerChainBlocks) {
    
    peerChainBlocks.forEach((block, index) => {
        if (index === 0 && block[index] !== this.blocks[0]) {
            return { errorMsg: "Invalid Chain. Genesis blocks must match" };
        }
        
        const isValidBlock = this.validateBlock(block);
        if (isValidBlock.errorMsg) return isValidBlock;

    });
    
    return true;
};

// --------------------------------------------------------------------------------
// ------------------ {{{SYNCHRONIZE PENDING}}} TRANSACATIONS ---------------------
// --------------------------------------------------------------------------------
Blockchain.prototype.synchronizePendingTransactions = async function(peerChainInfo) {
    
    if (peerChainInfo.pendingTransactions > 0) {
        await axios.get(peerChainInfo.nodeUrl + "/transactions/pending")
        .then( data => {
            const transactions = data.data;

            transactions.forEach(transaction => {
                    const transactionAdded = this.createNewTransaction(transaction);
                    
                    if (transactionAdded.transactionDataHash) {
                        this.broadcastTransactionToPeers(transactionAdded);
                    }
                });
        })
        .catch( error => console.log("ERROR::", error));
    }
    return;
};

// --------------------------------------------------------------------------------
// ------------------- {{{BROADCAST TRANSACTION }}} TO PEERS ----------------------
// --------------------------------------------------------------------------------
Blockchain.prototype.broadcastTransactionToPeers = async function(transaction) {
    let endpoints = [];
    this.networkNodes.forEach((peerUrl) => {
        endpoints.push(peerUrl + "/addToPendingTransactions");
    });
    
    await Promise.all(endpoints.map(endpoint => axios.post(endpoint, transaction)))
    .then(function(){}).catch(function(error){ console.log("ERROR:: ", error)});
};


module.exports = Blockchain;