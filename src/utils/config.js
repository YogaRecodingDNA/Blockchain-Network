const Block = require("../Block");
const Transaction = require("../Transaction");
const CryptoHashUtils = require("./CryptoHashUtils");

// GENESIS + FAUCET TRANSACTION CREATION DATE
const genesisDate = "2022-12-12T00:00:00.000Z";

// FAUCET KEYS / ADDRESS
const faucetPrivateKey = "1d513f8a9689d2c43852ab9a9777ed333811c1d9d6e1b90c47a7e9e214153308";
const faucetPublicKey = CryptoHashUtils.getPublicKeyFromPrivateKey(faucetPrivateKey);
const faucetAddress = CryptoHashUtils.getAddressFromPublicKey(faucetPublicKey);

// MINER KEYS / ADDRESS
const minerPrivateKey = "1d513f8a9689d2c43852ab9a9777ed333811c1d9d6e1b90c47a7e9e214153308";
const minerPublicKey = CryptoHashUtils.getPublicKeyFromPrivateKey(minerPrivateKey);
const minerAddress = CryptoHashUtils.getAddressFromPublicKey(minerPublicKey);

// GENESIS DUMMY DATA
const genesisAddress = "0000000000000000000000000000000000000000";
const genesisPublicKey = "00000000000000000000000000000000000000000000000000000000000000000";
const genesisSignature = [
    "0000000000000000000000000000000000000000000000000000000000000000",
    "0000000000000000000000000000000000000000000000000000000000000000"
];

// FAUCET TRANSACTION
const genesisFaucetTransaction = new Transaction(
    genesisAddress, // from Address
    faucetAddress, // to Address
    1000000000000, // Faucet value
    0, // mining fee
    genesisDate, // date created
    "genesis tx", // data
    genesisPublicKey, //senderPubKey
    undefined, // transactionDataHash
    genesisSignature, // senderSignature
    0, // minedInBlockIndex
    true // transferSuccessful
);

// GENESIS BLOCK
const genesisBlock = new Block( // SCREEN_CASE syntax common for hard code data
   0, // index
   [genesisFaucetTransaction], // transactions
   0 ,// difficulty
   undefined, // prevBlockHash
   minerAddress, // minedBy
   undefined, // blockDataHash
   0, // nonce
   genesisDate, // dateCreated
   undefined, // blockHash
);


module.exports = { 
    genesisBlock
};