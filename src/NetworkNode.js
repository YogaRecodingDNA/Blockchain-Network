const express = require("express");
const bodyParser = require("body-parser");
const Blockchain = require("./Blockchain");
const Config = require("./utils/Config");
// const uuid = require("uuid/v1");
const cors = require("cors");
const rp = require("request-promise");
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
    const ExpressListEndpoints = require("express-list-endpoints");
    let endpoints = ExpressListEndpoints(app);
    let listEndpoints = endpoints.map( endpoint => 
        `<li>${endpoint.methods} <a href="${endpoint.path}">${endpoint.path}</a></li>`).join("");
    res.send(
        "<h1>VinyasaChain - A simple unified blockchain network</h1>" +
        `<ul>${listEndpoints}</ul>`
    );
});

// INFO - Nodes may provide additional info by choice
app.get("/info", (req, res) => {
    res.json({
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

    res.json({
        "nodeId": Config.currentNodeId,
        "selfUrl": Config.currentNodeURL,
        "peers": vinyasa.getPeersData(),
        "chain": vinyasa.blocks,
        "pendingTransactions": vinyasa.pendingTransactions,
        "currentDifficulty": vinyasa.currentDifficulty,
        "miningJobs": null,
        "confirmedBalances": null
    });

});

// // Debug/Reset Chain - For debugging/testing only. Should reset entire chain to its initial state.
// app.get("/debug/reset-chain", (req, res) => {

// })
// .then(data => {
//     // TODO:

//     // Response message
//     res.json({});
// });


// // IMPLEMENTING BLOCKS ==============================================================
// // ==================================================================================
// // BLOCKS
// app.get("/blocks", (req, res) => {

// })
// .then(data => {
//     // TODO:

//     // Response message
//     res.json({});
// });

// // BLOCK BY INDEX
// app.get("/blocks/:blockIndex", (req, res) => {

// })
// .then(data => {
//     // TODO:

//     // Response message
//     res.json({});
// });


// // IMPLEMENTING TRANSACTIONS ========================================================
// // ==================================================================================
// // GET PENDING TRANSACTIONS
// app.get("/transactions/pending", (req, res) => {

// })
// .then(data => {
//     // TODO:

//     // Response message
//     res.json({});
// });

// // GET CONFIRMED TRANSACTIONS
// app.get("/transactions/confirmed", (req, res) => {

// })
// .then(data => {
//     // TODO:

//     // Response message
//     res.json({});
// });

// // GET TRANSACTION BY HASH
// app.get("/transactions/:transactionHash", (req, res) => {

// })
// .then(data => {
//     // TODO:

//     // Response message
//     res.json({});
// });

// // LIST ALL ACCOUNT BALANCES
// app.get("/balances", (req, res) => {

// })
// .then(data => {
//     // TODO:

//     // Response message
//     res.json({});
// });

// // LIST TRANSACTIONS FOR ADDRESS
// app.get("/address/:address/transactions", (req, res) => {

// })
// .then(data => {
//     // TODO:

//     // Response message
//     res.json({});
// });

// // GET BALANCES FOR ADDRESS
// app.get("/address/:address/balance", (req, res) => {

// })
// .then(data => {
//     // TODO:

//     // Response message
//     res.json({});
// });

// // BALANCES INVALID FOR ADDRESS
// app.get("/address/invalidAddress/balance", (req, res) => {

// })
// .then(data => {
//     // TODO:

//     // Response message
//     res.json({});
// });

// // SEND TRANSACTION
// app.post("/transactions/send", (req, res) => {

// })
// .then(data => {
//     // TODO:

//     // Response message
//     res.json({});
// });


// // IMPLEMENTING MINING ========================================================
// // ============================================================================
// // GET MINING JOB
// app.get("/mining/get-mining-job/:minerAddress", (req, res) => {

// })
// .then(data => {
//     // TODO:

//     // Response message
//     res.json({});
// });

// // SUBMIT MINED BLOCK | IMPLEMENTING MINING (validate)
// app.post("/mining/submit-mined-block", (req, res) => {

// })
// .then(data => {
//     // TODO:

//     // Response message
//     res.json({});
// });

// // DEBUG -> MINE A BLOCK
// app.get("/debug/mine/:minerAddress/:difficulty", (req, res) => {

// })
// .then(data => {
//     // TODO:

//     // Response message
//     res.json({});
// });


// // PEERS AND SYNCHRONIZATION ========================================================
// // ==================================================================================
// // LIST ALL PEERS
// app.get("/peers", (req, res) => {

// });

// // CONNECT A PEER (validate)
// app.post("/peers/connect", (req, res) => {

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

// DELETE LOST PEERS
// If a peer is contacted and does not respond, delete it from the connected peers



// REGISTER A NODE WITH THE NETWORK
app.listen(Config.defaultServerPort, function() {
    console.log(`Success! Listening on port ${Config.defaultServerPort}...`);
});