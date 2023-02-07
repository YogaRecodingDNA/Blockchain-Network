const CryptoHashUtils = require("./CryptoHashUtils");
// DEFAULT SERVER PORT AND URL
const PORT = process.argv[2]; // 2nd arg of node package "script" is port number
const genesisNodeURL = "http://localhost:5555"
const currentNodeURL = process.argv[3]; // 3rd arg of node package "script" is url
const currentNodeId = CryptoHashUtils.createId();
const currentNodeMiningAddress = "977936f1322d63c133c00611a597f788b40854ce";


// GENESIS + FAUCET TRANSACTION CREATION DATE
// let genesisDate = "2022-12-22T08:18:11.847Z";
let genesisDate = new Date().toISOString();

// GENESIS DUMMY DATA
const genesisDummyData = "7f513f8a9689d2c43852ab9a9777ed333811c1d9d6e1b90c47a7e9e214153308";

// GENESIS DUMMY ACCOUNT
const nullPrivateKey = "0000000000000000000000000000000000000000000000000000000000000000";
const nullPublicKey = "00000000000000000000000000000000000000000000000000000000000000000";
const nullMinerAddress = "0000000000000000000000000000000000000000";
const nullSenderSignature = [
    "0000000000000000000000000000000000000000000000000000000000000000",
    "0000000000000000000000000000000000000000000000000000000000000000"
];

// FAUCET KEYS / ADDRESS
const faucetPrivateKey = "687e39772b92fd475264cf6bd059d2201760471b6ed04cc02b73306c24f5cc30";
const faucetPublicKey = CryptoHashUtils.getPublicKeyFromPrivateKey(faucetPrivateKey);
const faucetAddress = CryptoHashUtils.getAddressFromPublicKey(faucetPublicKey);

module.exports = {
    defaultServerHost: "localhost",
    defaultServerPort: PORT,
    genesisNodeURL,
    currentNodeURL,
    currentNodeId,
    currentNodeMiningAddress,
    genesisDate,
    genesisDummyData,
    nullMinerAddress,
    nullPrivateKey,
    nullPublicKey,
    nullSenderSignature,
    faucetAddress,
    faucetPublicKey,
    faucetPrivateKey,
    initialDifficulty: 5,
    blockReward: 5000000, // 1 PRANA === 1,000 VI === 1,000,000 NYASA
    minimumTransactionFee: 10,
    safeConfirmations: 6
};


// // GENESIS / FAUCET TRANSACTION
// const genesisFaucetTransaction = new Transaction(
//     faucetAddress, // to Address
//     1000000000000, // Faucet value
//     10, // mining fee
//     genesisDate, // date created
//     genesisDummyData, // data
//     nullPublicKey, //senderPubKey
//     nullPrivateKey // private key
// );

// // GENESIS BLOCK
// const genesisBlock = new Block(
//    0, // index
//    [genesisFaucetTransaction], // transactions
//    0,// difficulty
//    undefined, // prevBlockHash
//    nullMinerAddress, // minedBy
//    0, // nonce
//    genesisDate // dateCreated
// );

// console.log(genesisFaucetTransaction);