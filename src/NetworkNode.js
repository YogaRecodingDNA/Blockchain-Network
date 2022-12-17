const express = require("express");
const Blockchain = require("./Blockchain");
const Config = require("./utils/Config");
const RP = require("request-promise");
const cors = require("cors");
const bodyParser = require("body-parser");
const { StatusCodes } = require("http-status-codes");

// Create Express app
const app = express();
app.use(bodyParser.json()); // Enable JSON data in the HTTP request body
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)

const vinyasa = new Blockchain(); // CREATE NEW BLOCKCHAIN INSTANCE

/** RESTful API KEY
 STARS = ******** SECTION **********
 DASHES = -------- ENDPOINT --------
 */

// ****************************************************************************
// ***************************** CONTENTS *************************************
// ****************************************************************************
// ----------------------------------------------------------------------------
// -------------- HOME / SIMPLE NAV ENDPOINT LINKS PAGE -----------------------
// ----------------------------------------------------------------------------
app.get("/", (req, res) => {
    if (!res) {
        res.status(StatusCodes.NOT_FOUND).json({errorMsg: "Page not found."})
    } else {
        const ExpressListEndpoints = require("express-list-endpoints");
        let endpoints = ExpressListEndpoints(app);
        let listEndpoints = endpoints.map( endpoint => 
            `<li>${endpoint.methods} <a href="${endpoint.path}">${endpoint.path}</a></li>`).join("");
            
            res.status(StatusCodes.OK)
            .send(
                "<h1>VinyasaChain - A simple unified blockchain network</h1>" +
                `<ul>${listEndpoints}</ul>`
                );
            }
        });

        
// ****************************************************************************
// ***************************** TEST/DEBUG ***********************************
// ****************************************************************************
// ----------------------------------------------------------------------------
// -------------------------- BLOCKCHAIN INFO ---------------------------------
// ----------------------------------------------------------------------------
app.get("/info", (req, res) => { // Nodes may provide additional info by choice
    res.status(StatusCodes.OK)
    .json({
        "about": "VinyasaChain",
        "nodeId": Config.currentNodeId,
        "chainId": vinyasa.blocks[0].blockHash,
        "nodeUrl": Config.currentNodeURL,
        "peersTotal": vinyasa.networkNodes.size, // Number of peers in network
        "peersMap": vinyasa.getPeersData(), // Number of peers in network
        "currentDifficulty": vinyasa.currentDifficulty,
        "blocksCount": vinyasa.blocks.length,
        "cumulativeDifficulty": vinyasa.calculateCumulativeDifficulty(),
        "confirmedTransactions": vinyasa.getConfirmedTransactions().length,
        "pendingTransactions": vinyasa.pendingTransactions.length
    });
});


// ----------------------------------------------------------------------------
// ----------------------------- NODED INFO -----------------------------------
// ----------------------------------------------------------------------------
app.get("/debug", (req, res) => {

    res.status(StatusCodes.OK)
    .json({
        "nodeId": Config.currentNodeId,
        "selfUrl": Config.currentNodeURL,
        "peers": vinyasa.getPeersData(),
        "chain": vinyasa.blocks,
        "pendingTransactions": vinyasa.pendingTransactions,
        "currentDifficulty": vinyasa.currentDifficulty,
        "miningJobs": vinyasa.miningJobs,
        "confirmedBalances": null // TODO:
    });

});


// ----------------------------------------------------------------------------
// ----------------------------- RESET CHAIN  ---------------------------------
// ----------------------------------------------------------------------------
app.get("/debug/reset-chain", (req, res) => { // Reset entire chain to its initial state.
    vinyasa.resetChain();
    const blocks = vinyasa.blocks;

    if (!vinyasa.resetChain()) {
        res.json({
            "message": "Failed to reset the chain.",
            "blockchain": vinyasa
        });
    } else {
        res.status(StatusCodes.OK)
        .json({
            "message": "The chain was reset to its genesis block.",
            "blockchain": vinyasa
        });
    }
});


// ****************************************************************************
// ******************************* BLOCKS *************************************
// ****************************************************************************
// ----------------------------------------------------------------------------
// --------------------------- GET ALL BLOCKS ---------------------------------
// ----------------------------------------------------------------------------
app.get("/blocks", (req, res) => {
    res.status(StatusCodes.OK).json({ "blocks": vinyasa.blocks });
});


// ----------------------------------------------------------------------------
// ------------------------- GET BLOCK BY INDEX -------------------------------
// ----------------------------------------------------------------------------
app.get("/blocks/:blockIndex", (req, res) => {
    const blockIndex = req.params.blockIndex;
    const block = vinyasa.blocks[blockIndex];

    if (!block) {
        res.status(StatusCodes.NOT_FOUND).json({ errorMsg: "Invalid block index."});
    } else {
        res.json({ "block": block})
        res.status(StatusCodes.OK);
    }
});


// ****************************************************************************
// ***************************** TRANSACTIONS *********************************
// ****************************************************************************
// ----------------------------------------------------------------------------
// ----------------------- CREATE/SEND TRANSACTION ----------------------------
// ----------------------------------------------------------------------------
app.post("/transactions/send", (req, res) => {
    const requestBody = req.body;
    const newTransaction = vinyasa.createNewTransaction(requestBody);
    
    if (newTransaction.errorMsg) {
        res.json(newTransaction.errorMsg);
        return;
    }

    if (newTransaction.transactionDataHash) {
        let requestPromises = [];
        vinyasa.networkNodes.forEach(peer => {
            const requestOptions = {
                uri: peer + "/addToPendingTransactions",
                method: "POST",
                body: newTransaction,
                json: true
            };

            requestPromises.push(RP(requestOptions));
        });

        Promise.all(requestPromises)
        .then(() => {
            res.status(StatusCodes.CREATED).json({ 
                message: "Transaction created and successfully broadcast.",
                transactionID: newTransaction.transactionDataHash,
                transaction: newTransaction
            });
        })
        .catch(err => res.status(400).json({ errorMsg: err}));

    } else res.status(StatusCodes.BAD_REQUEST).json(newTransaction);
});

// ----------------------------------------------------------------------------
// ---------------------- ADD TRANSACTION TO PENDING --------------------------
// ----------------------------------------------------------------------------
app.post("/addToPendingTransactions", (req,res) => {
    const transactionObject = req.body;
    // Add transaction to transaction pool and receive next block's index
    const nextBlock = vinyasa.addNewTransactionToPendingTransactions(transactionObject);

    res.json({ message: `Transaction will be added to block ${nextBlock}`});
})


// ----------------------------------------------------------------------------
// ----------------------- GET PENDING TRANSACTIONS ---------------------------
// ----------------------------------------------------------------------------
app.get("/transactions/pending", (req, res) => {
    res.status(StatusCodes.OK).json({
        "pending-transactions": vinyasa.pendingTransactions
    });
});


// ----------------------------------------------------------------------------
// ---------------------- GET CONFIRMED TRANSACTIONS --------------------------
// ----------------------------------------------------------------------------
app.get("/transactions/confirmed", (req, res) => {
    const confirmedTransactions = vinyasa.getConfirmedTransactions();
    if (!confirmedTransactions.length >= 1) res.json({errorMsg: "Zero confirmed. There should always be a genesis transaction."});

    res.status(StatusCodes.OK).json(confirmedTransactions);
});


// ----------------------------------------------------------------------------
// ---------------------- GET TRANSACTION BY HASH -----------------------------
// ----------------------------------------------------------------------------
app.get("/transactions/:transactionHash", (req, res) => {
    const transactionHash = req.params.transactionHash;
    const transaction = vinyasa.findTransactionByDataHash(transactionHash);

    if (!transaction) res.status(StatusCodes.NOT_FOUND).send("404 NOT FOUND");

    res.status(StatusCodes.OK).json(transaction)
});


// ----------------------------------------------------------------------------
// -------------------- LIST TRANSACTIONS FOR ADDRESS -------------------------
// ----------------------------------------------------------------------------
app.get("/address/:address/transactions", (req, res) => {
    const address = req.params.address;
    const addressHistory = vinyasa.getAddressTransactionHistory(address);

    if (!address) res.status(StatusCodes.NOT_FOUND).send("404 NOT FOUND");

    res.status(StatusCodes.OK).json({
        address,
        addressHistory
    });

});



// ****************************************************************************
// ****************************** BALANCES ************************************
// ****************************************************************************
// ----------------------------------------------------------------------------
// ---------------------- LIST ALL ACCOUNT BALANCES ---------------------------
// ----------------------------------------------------------------------------
app.get("/balances", (req, res) => {
    const allBalances = vinyasa.getAllBalances();

    res.status(StatusCodes.OK).json(allBalances);
});


// ----------------------------------------------------------------------------
// ---------------------- GET BALANCES BY ADDRESS -----------------------------
// ----------------------------------------------------------------------------
app.get("/address/:address/balance", (req, res) => {
    const address = req.params.address;
    const addressBalances = vinyasa.getBalancesForAddress(address);

    if (!addressBalances) res.status(StatusCodes.NOT_FOUND).json({errorMsg: "Invalid address"});

    res.status(StatusCodes.OK).json({addressBalances})
});


// ----------------------------------------------------------------------------
// ------------------ GET INVALID BALANCES BY ADDRESS -------------------------
// ----------------------------------------------------------------------------
// // BALANCES INVALID FOR ADDRESS
// app.get("/address/invalidAddress/balance", (req, res) => {
// });


// ****************************************************************************
// *****************************  MINING **************************************
// ****************************************************************************
// ----------------------------------------------------------------------------
// --------------------------- GET MINING JOB ---------------------------------
// ----------------------------------------------------------------------------
app.get("/mining/get-mining-job", (req, res) => {
    // Miner puts in request for block candidate
    // Node prepares block candidate, coinbase tx, rewards/fees...
    // Miners mine and submit the mined block to the node
    const minerAddress = Config.currentNodeId;
    // const minerAddress = req.params.minerAddress;

    const blockCandidate = vinyasa.prepareBlockCandidate(minerAddress);

    res.status(StatusCodes.OK).json({ 
        index: blockCandidate.index,
        transactionsIncluded: blockCandidate.transactions,
        difficulty: blockCandidate.difficulty,
        expectedReward: blockCandidate.transactions[0].value,
        rewardAddress: blockCandidate.transactions[0].to,
        blockDataHash: blockCandidate.blockdataHash
    });
});


// ----------------------------------------------------------------------------
// ----------------------- SUBMIT MINED BLOCK ---------------------------------
// ----------------------------------------------------------------------------
app.post("/mining/submit-mined-block", (req, res) => {

});


// ----------------------------------------------------------------------------
// ------------------- TEST/DEBUG -> MINE A BLOCK -----------------------------
// ----------------------------------------------------------------------------
app.get("/debug/mine/:minerAddress/:difficulty", (req, res) => {
    const minerAddress = req.params.minerAddress;
    const difficulty = req.params.difficulty;

    const newBlock = vinyasa.mineNewBlock(minerAddress, +difficulty);

    res.status(StatusCodes.OK).json({ newBlock })
});


// // PEERS AND SYNCHRONIZATION ========================================================
// // ==================================================================================
// // LIST ALL PEERS
// app.get("/peers", (req, res) => {
    // TODO:
// });

// // CONNECT A PEER (validate)
// app.post("/peers/connect", (req, res) => {
    // TODO:
// });

// // NOTIFY PEERS ABOUT NEW BLOCK
// app.post("/peers/notify-new-block", (req, res) => {
    
// });

// REGISTER NEW NODES - Network Node Data Structure:
// networkNode = {
//     NodeId: "", // unique_string - Current Node's unique identifier
//     SelfUri: "", // URL - Base URL of REST endpoints
//     Peers: {}, // Map map(nodeId -> URL) of peers connected to this node
//     Chain: new Blockchain(), // The Blockchain (Blocks, Transactions, Balances, Mining jobs)
//     chainID: "" // Genesis Block Hash identifies the chain
// };

// DELETE LOST PEERS    // TODO:
// If a peer is contacted and does not respond, delete it from the connected peers



// REGISTER A NODE WITH THE NETWORK
app.listen(Config.defaultServerPort, function() {
    console.log(`Success! Listening on port ${Config.defaultServerPort}...`);
});