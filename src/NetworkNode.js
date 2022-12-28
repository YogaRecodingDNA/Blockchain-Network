const express = require("express");
const Blockchain = require("./Blockchain");
const Config = require("./utils/Config");
const axios = require('axios');
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
    const chainId = (!vinyasa.blocks.length >= 1) ? "Not yet connected to VinyasaChain. Please connect" : vinyasa.blocks[0].blockHash;

    res.status(StatusCodes.OK)
    .json({
        "about": "VinyasaChain",
        "nodeId": Config.currentNodeId,
        "chainId": chainId,
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
// ----------------------------- NODE INFO -----------------------------------
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
app.get("/mining/get-mining-job/:minerAddress", (req, res) => {
    const minerAddress = req.params.minerAddress || Config.currentNodeId;
    const newBlock = vinyasa.mineNewBlock(minerAddress);

    res.status(StatusCodes.OK).json({ 
        index: newBlock.index,
        transactionsIncluded: newBlock.transactions,
        difficulty: newBlock.difficulty,
        expectedReward: newBlock.transactions[0].value,
        rewardAddress: newBlock.transactions[0].to,
        blockDataHash: newBlock.blockdataHash
    });
});


// ----------------------------------------------------------------------------
// ----------------------- SUBMIT MINED BLOCK ---------------------------------
// ----------------------------------------------------------------------------
// app.post("/mining/submit-mined-block", (req, res) => {

// });


// ----------------------------------------------------------------------------
// ------------------- TEST/DEBUG -> MINE A BLOCK -----------------------------
// ----------------------------------------------------------------------------
app.get("/debug/mine/:minerAddress/:difficulty", (req, res) => {
    const minerAddress = req.params.minerAddress;
    const difficulty = req.params.difficulty;

    const newBlock = vinyasa.mineNewBlock(minerAddress, +difficulty);

    res.status(StatusCodes.OK).json({ newBlock })
});


// ****************************************************************************
// ************************ PEERS / SYNCHRONIZATION ***************************
// ****************************************************************************

// ----------------------------------------------------------------------------
// -------------------------- LIST ALL PEERS ----------------------------------
// ----------------------------------------------------------------------------
app.get("/peers", (req, res) => {
    const peers = vinyasa.getPeersData();

    res.status(StatusCodes.OK).json(peers);
});


// ----------------------------------------------------------------------------
// -------------------------- CONNECT A PEER ----------------------------------
// ----------------------------------------------------------------------------
// 1. Get peer info + error handle conflicts / bad requests
// 2. Register new peer with current node
// 3. Synchronize chains and transactions
app.post("/peers/connect", (req, res) => {
    const peer = req.body.peerUrl;
    let peerNodeId;
    let peerNodeUrl;
    
    if (peer === undefined) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            errorMsg: "The request body is missing the 'peerUrl:' value"
        });
    }

    // 1. Get peer info -> Validate
    axios.get(peer + "/info")
        .then( async function(peerInfo) {
            peerInfo = peerInfo.data;
            peerNodeId = peerInfo.nodeId;
            peerNodeUrl = peerInfo.nodeUrl;
                    // Avoid connecting to self
            if (peerNodeUrl === Config.currentNodeURL) {
                res.status(StatusCodes.CONFLICT).json({
                    errorMsg: "Cannot to connect to self."
                });  // Chain ID's must match
            } else if (peerInfo.chainId !== vinyasa.blocks[0].blockHash) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    errorMsg: "Chain ID's must match"
                });  // Avoid double-connecting to same peer
            } else if (vinyasa.networkNodes.has(peerNodeId)) {
                res.status(StatusCodes.CONFLICT).json({
                    errorMsg: `Already connected to peer: ${peerNodeUrl}`
                });
            } else {
                // Remove any peer with the same URL
                vinyasa.networkNodes.forEach( (peerUrl, peerId) => {
                    if (peerUrl === peerNodeUrl) {
                        vinyasa.networkNodes.delete(peerId);
                    }
                });
                
                // 2. Register new peer with current node
                vinyasa.networkNodes.set(peerNodeId, peerNodeUrl);

        
                // 3. Synchronize chains and transactions
                vinyasa.synchronizeTheChain(peerInfo);
                vinyasa.synchronizePendingTransactions(peerInfo);
        
                res.status(StatusCodes.OK).json({
                    message: `Successfully connected to peer: ${peerNodeUrl}`
                });

            }
        })
        .catch( function(error) {
            console.log(error.message);
            res.status(StatusCodes.BAD_REQUEST).json({
                errorMsg: `Cannot connect to peer: ${peer}`
            });
        });

});


// ----------------------------------------------------------------------------
// --------------- BROADCAST/REGISTER NEW PEER TO NETWORK ---------------------
// ----------------------------------------------------------------------------
// app.post("/broadcast-register-peer", (req, res) => {
//     const peerUrl = req.body.peerUrl;
//     const peerId = req.body.peerId;
//     const peerNotPreExisting = !vinyasa.networkNodes.has(peerId);
//     const notCurrentNode = vinyasa.currentNodeURL !== peerUrl;
    
//     if (peerNotPreExisting && notCurrentNode) {
//         vinyasa.networkNodes.set(peerId, peerUrl);
//         res.json({
//             message: "Registered new peer node successfully"
//         })
//         return vinyasa.networkNodes;
//     }
    
//     res.json({
//         message: "Registered new peer node successfully"
//     })
//     return false;

// });


// ----------------------------------------------------------------------------
// ---------------------- REGISTER NETWORK TO PEER ----------------------------
// ----------------------------------------------------------------------------
// app.post("/register-network-to-peer", (req, res) => {
//     const allPeers = vinyasa.networkNodes;
//     const pendingTransactions = vinyasa.pendingTransactions;
    
//     allPeers.forEach((peerUrl, peerId) => {
//         const peerNotPreExisting = !vinyasa.networkNodes.has(peerId);
//         const notCurrentNode = vinyasa.currentNodeURL !== peerUrl;
        
//         if (peerNotPreExisting && notCurrentNode) {
//             vinyasa.networkNodes.set(peerId, peerUrl);
//         }
//     });
    
//     vinyasa.pendingTransactions = pendingTransactions;
    
//     res.json({
//         message: "Successfully registered network nodes to new peer"
//     })
// });


// ----------------------------------------------------------------------------
// -------------------------- CONSENSUS ALGORITHM -----------------------------
// ----------------------------------------------------------------------------
app.get("/consensus", (req, res) => {
    const requestPromises = [];

    vinyasa.networkNodes.forEach( peerUrl => {
        const requestOptions = {
            uri: peerUrl + "/blockchain",
            method: "GET",
            json: true
        };
        requestPromises.push(RP(requestOptions));
    });

    Promise.all(requestPromises)
    .then( blockchains => {
        let currentChainLength = vinyasa.blocks.length;
        let longestChain = null;
        let updatedPendingTransactions = null;
        
        blockchains.forEach( chain => {
            if (chain.blocks.length > currentChainLength) {
                currentChainLength = chain.blocks.length;
                longestChain = chain.blocks;
                updatedPendingTransactions = chain.pendingTransactions;
            }
        });

        if (!longestChain) {
            res.json({
                message: "Blockchain consensus resulted in the current chain not being replaced",
                blockchain: vinyasa.blocks
            })
            return "!longestChain";
        } else {
            vinyasa.blocks = longestChain;
            vinyasa.pendingTransactions = updatedPendingTransactions;

            res.status(StatusCodes.OK).json({
                message: "Current chain has been replaced by a longer chain",
                blockchain: vinyasa.blocks
            });
            return vinyasa.blocks;
        }
    })
    .catch( error => res.status(StatusCodes.BAD_REQUEST).json({ errorMsg: error.message }));
});


// ----------------------------------------------------------------------------
// ---------------------- NOTIFY PEERS ABOUT NEW BLOCK ------------------------
// ----------------------------------------------------------------------------
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


// ****************************************************************************
// *************************** BLOCK EXPLORER *********************************
// ****************************************************************************

// ----------------------------------------------------------------------------
// -------------------------- GET BLOCKCHAIN ----------------------------------
// ----------------------------------------------------------------------------
app.get("/blockchain", (req, res) => {
    res.send(vinyasa);
    
})




// REGISTER A NODE WITH THE NETWORK
app.listen(Config.defaultServerPort, async function() {

    if (vinyasa.currentNodeURL !== Config.genesisNodeURL) {
        // All new nodes add genesisNode to peers Map (networkNodes)
        await axios.get(Config.genesisNodeURL + "/info")
        .then( info => {
            info = info.data;
            vinyasa.networkNodes.set(info.nodeId, info.nodeUrl);
            // console.log("INFO ", info);
            // console.log("Aync genesis", vinyasa.networkNodes);
            // console.log("Genesis HASH", info.chainId);
        })
        .catch( error => console.error("ERROR: ", error));

        // Run consensus to sync with genesisNode's blockchain
        await axios.get(vinyasa.currentNodeURL + "/consensus")
        .then(data => data )
        .catch(error => console.error("ERROR: ", error));
    }

    console.log(`Success! Listening on port ${Config.defaultServerPort}...`);
});


module.exports = {
    app,
    vinyasa
};