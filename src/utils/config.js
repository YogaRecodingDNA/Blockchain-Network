const Block = require("../Block");
const Transaction = require("../Transaction");
const CryptoHashUtils = require("./CryptoHashUtils");
// DEFAULT SERVER PORT AND URL
const PORT = process.argv[2]; // 2nd arg of node package "script" is port number
const currentNodeURL = process.argv[3]; // 3rd arg of node package "script" is url
const currentNodeId = CryptoHashUtils.createId();

// GENESIS + FAUCET TRANSACTION CREATION DATE
let genesisDate = new Date();
genesisDate = genesisDate.toISOString();

// GENESIS DUMMY DATA
const genesisDummyData = "7f513f8a9689d2c43852ab9a9777ed333811c1d9d6e1b90c47a7e9e214153308";

// GENESIS DUMMY ACCOUNT
const genesisPrivateKey = "0000000000000000000000000000000000000000000000000000000000000000";
const genesisPublicKey = "00000000000000000000000000000000000000000000000000000000000000000";
const genesisMinerAddress = "0000000000000000000000000000000000000000";

// FAUCET KEYS / ADDRESS
const faucetPrivateKey = "1d513f8a9689d2c43852ab9a9777ed333811c1d9d6e1b90c47a7e9e214153308";
const faucetPublicKey = CryptoHashUtils.getPublicKeyFromPrivateKey(faucetPrivateKey);
const faucetAddress = CryptoHashUtils.getAddressFromPublicKey(faucetPublicKey);

// GENESIS / FAUCET TRANSACTION
const genesisFaucetTransaction = new Transaction(
    faucetAddress, // to Address
    1000000000000, // Faucet value
    10, // mining fee
    genesisDate, // date created
    genesisDummyData, // data
    genesisPublicKey, //senderPubKey
    genesisPrivateKey // private key
);

// GENESIS BLOCK
const genesisBlock = new Block(
   0, // index
   [genesisFaucetTransaction], // transactions
   0,// difficulty
   undefined, // prevBlockHash
   genesisMinerAddress, // minedBy
   0, // nonce
   genesisDate // dateCreated
);

console.log(genesisFaucetTransaction);

module.exports = {
    defaultServerHost: "localhost",
    defaultServerPort: PORT,
    currentNodeURL,
    currentNodeId,
    genesisBlock,
    genesisDummyData,
    genesisMinerAddress,
    genesisPrivateKey,
    genesisPublicKey,
    faucetAddress,
    faucetPublicKey,
    faucetPrivateKey,
    initialDifficulty: 5,
    blockReward: 50000000,
    minimumTransactionFee: 10,
    safeConfirmations: 6
};