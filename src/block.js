const { GENESIS_DATA } = require("../config");
const Transaction = require("./transaction");
const CryptoJS = require("crypto-js");
const EC = require('elliptic').ec;
const secp256k1 = new EC('secp256k1');

function Block({ index, transactions, difficulty, prevBlockHash, minedBy, blockDataHash, nonce, dateCreated, blockHash }) {
    this.index = index;
    this.transactions = transactions;
    this.difficulty = difficulty;
    this.prevBlockHash = prevBlockHash;
    this.minedBy = minedBy;
    this.blockDataHash = blockDataHash;
    this.nonce = nonce;
    this.dateCreated = dateCreated;
    this.blockHash = blockHash;
}

Block.genesis = function() {
    // GENESIS BLOCK DATA
    let genesisBlock = GENESIS_DATA;

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
    genesisBlock.transactions = [genesisFaucetTransaction];
    genesisBlock.dateCreated = genesisDate.toISOString();

    return new this(genesisBlock);
};


Block.prototype.calculateBlockDataHash = function() {
    let blockData = {
        index: this.index,
        transactions: this.transactions.map(transaction => Object({
            from: transaction.from,
            to: transaction.to,
            value: transaction.value,
            fee: transaction.fee,
            dateCreated: transaction.dateCreated,
            data: transaction.data,
            senderPubKey: transaction.senderPubKey,
            transactionDataHash: transaction.transactionDataHash,
            senderSignature: transaction.senderSignature,
            minedInBlockIndex: transaction.minedInBlockIndex,
            transferSuccessful: transaction.transferSuccessful
        })),
        difficulty: this.difficulty,
        prevBlockHash: this.prevBlockHash,
        minedBy: this.minedBy
    };

    this.blockDataHash = CryptoJS.SHA256(blockData).toString();
};

Block.prototype.calculateBlockHash = function() {

    this.blockHash = CryptoJS.SHA256(
        this.blockDataHash + this.nonce + this.dateCreated).toString();
};


module.exports = Block;


// AUTO GENERATED ADDRESS / PRIVATE KEY
    // Address: 0x0987F4c323B5c85890b82925292B5E7d4bf5B416
    // Private key: 1d513f8a9689d2c43852ab9a9777ed333811c1d9d6e1b90c47a7e9e214153308
