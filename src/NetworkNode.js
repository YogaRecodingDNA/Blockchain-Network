const express = require("express");
const Block = require("./Block");
const Blockchain = require("./Blockchain");
const Transaction = require("./Transaction");
const CryptoHashUtils = require("./utils/CryptoHashUtils");
const Config = require("./utils/Config");
// const uuid = require("uuid/v1");
const rp = require("request-promise");
const cors = require("cors");
const bodyParser = require("body-parser");
const { StatusCodes } = require("http-status-codes");
const { json } = require("express");
// const PORT = process.argv[2];

// Create Express app
const app = express();
app.use(bodyParser.json()); // Enable JSON data in the HTTP request body
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cors()); // Enable Cross-Origin Resource Sharing (CORS)

const vinyasa = new Blockchain();

// ENDPOINTS - BUILDING THE BLOCKCHAIN NODE  ========================================
// ==================================================================================

// HOME
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

// INFO - Nodes may provide additional info by choice
app.get("/info", (req, res) => {
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

// // DEBUG - Debug Info (All Node Data)
app.get("/debug", (req, res) => {

    res.status(StatusCodes.OK)
    .json({
        "nodeId": Config.currentNodeId,
        "selfUrl": Config.currentNodeURL,
        "peers": vinyasa.getPeersData(),
        "chain": vinyasa.blocks,
        "pendingTransactions": vinyasa.pendingTransactions,
        "currentDifficulty": vinyasa.currentDifficulty,
        "miningJobs": null, // TODO:
        "confirmedBalances": null // TODO:
    });

});

// Debug/Reset Chain - For debugging/testing only. Should reset entire chain to its initial state.
app.get("/debug/reset-chain", (req, res) => {
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


// IMPLEMENTING BLOCKS ==============================================================
// ==================================================================================
// BLOCKS
app.get("/blocks", (req, res) => {
    res.status(StatusCodes.OK).json({ "blocks": vinyasa.blocks });
});

// BLOCK BY INDEX
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


// IMPLEMENTING TRANSACTIONS ========================================================
// ==================================================================================
// GET PENDING TRANSACTIONS
app.get("/transactions/pending", (req, res) => {
    res.status(StatusCodes.OK).json({
        "pending-transactions": vinyasa.pendingTransactions
    });
});

// // GET CONFIRMED TRANSACTIONS
// app.get("/transactions/confirmed", (req, res) => {

// });

// // GET TRANSACTION BY HASH
// app.get("/transactions/:transactionHash", (req, res) => {

// });

// // LIST ALL ACCOUNT BALANCES
// app.get("/balances", (req, res) => {

// });

// // LIST TRANSACTIONS FOR ADDRESS
// app.get("/address/:address/transactions", (req, res) => {

// });

// // GET BALANCES FOR ADDRESS
// app.get("/address/:address/balance", (req, res) => {

// });

// // BALANCES INVALID FOR ADDRESS
// app.get("/address/invalidAddress/balance", (req, res) => {

// });

// SEND TRANSACTION
app.post("/transactions/send", (req, res) => {
    const requestBody = req.body;

    const newTransaction = vinyasa.createNewTransaction(requestBody);

    if (newTransaction.transactionDataHash) {
        // BROADCAST TRANSACTION to peers TODO:
        res.status(StatusCodes.CREATED).json({newTransaction});
    } else {
        res.status(StatusCodes.BAD_REQUEST).json(newTransaction);
    }
});


// // IMPLEMENTING MINING ========================================================
// // ============================================================================
// // GET MINING JOB
// app.get("/mining/get-mining-job/:minerAddress", (req, res) => {

// });

// // SUBMIT MINED BLOCK | IMPLEMENTING MINING (validate)
// app.post("/mining/submit-mined-block", (req, res) => {

// });

// // DEBUG -> MINE A BLOCK
// app.get("/debug/mine/:minerAddress/:difficulty", (req, res) => {

// });


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