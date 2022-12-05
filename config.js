const Block = require("./src/block");
const Transaction = require("./src/transaction");
const CryptoJS = require("crypto-js");
const EC = require('elliptic').ec;
const secp256k1 = new EC('secp256k1');

 // GENESIS + FAUCET TRANSACTION CREATION DATE
 const genesisDate = new Date();

 // FAUCET KEYS / ADDRESS
 const faucetPrivateKey = "1d513f8a9689d2c43852ab9a9777ed333811c1d9d6e1b90c47a7e9e214153308";
 const keyPairElliptic = secp256k1.keyFromPrivate(faucetPrivateKey);
 const faucetPublicKey = keyPairElliptic.getPublic().getX().toString(16) +
 (keyPairElliptic.getPublic().getY().isOdd() ? "1" : "0");
 const faucetAddress = CryptoJS.RIPEMD160(faucetPublicKey).toString();

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
     genesisDate.toISOString(), // date created
     "genesis tx", // data
     genesisPublicKey, //senderPubKey
     undefined, // transactionDataHash
     genesisSignature, // senderSignature
     0, // minedInBlockIndex
     true // transferSuccessful
 );
 
 // GENESIS BLOCK INSERT DYNAMIC DATA
//  genesisBlock.transactions = [genesisFaucetTransaction];
//  genesisBlock.dateCreated = genesisDate.toISOString();

const GENESIS_DATA = new Block( // SCREEN_CASE syntax common for hard code data
    0, // index
    [genesisFaucetTransaction], // transactions
    0 ,// difficulty
    undefined, // prevBlockHash
    genesisAddress, // minedBy
    undefined, // blockDataHash
    0, // nonce
    genesisDate.toISOString(), // dateCreated
    undefined, // blockHash
);

module.exports = { GENESIS_DATA };