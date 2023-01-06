const Config = require("./utils/Config");
const CryptoHashUtils = require("./utils/CryptoHashUtils");


// ===============================================================================
// ======================= TRANSACTION CONSTRUCTOR ===============================
// ===============================================================================
// !!!Sending Private Key for testing purposes only!!!!!!
function Transaction(from, to, value, fee, dateCreated, data, senderPubKey, transactionDataHash, senderPrivKey, senderSignature) {
    this.from = from || CryptoHashUtils.getAddressFromPublicKey(senderPubKey);// address from PubKey
    this.to = to;                       // Recipient address - 40 hex digits
    this.value = value;                 // Positive integer
    this.fee = fee;                     // Fee for miner (positive integer)
    this.dateCreated = dateCreated || new Date().toISOString();
    this.data = data;                   // Transaction data (payload/comments) - optional string
    this.senderPubKey = senderPubKey;   // Sender public key – 65 hex digits
    this.transactionDataHash = transactionDataHash || this.calculateDataHash();
    this.senderPrivKey = senderPrivKey; // Sender private key – 64 hex digits (FOR TESTING ONLY)
    this.senderSignature = senderSignature || this.signTransaction(senderPrivKey);
    this.minedInBlockIndex = undefined; // Determined at Mining Process
    this.transferSuccessful = undefined;// Determined at Mining Process

    // Block index and transferSuccesful settings for Genesis Transaction
    if (this.data === Config.genesisDummyData) {
        this.minedInBlockIndex = 0;
        this.transferSuccessful = true;
    }
}


// ===============================================================================
// ====================== Calculate Transaction Data Hash ========================
// ===============================================================================
Transaction.prototype.calculateDataHash = function() {

    return CryptoHashUtils.calcTransactionDataHash(
        this.from,
        this.to,
        this.value,
        this.fee,
        this.dateCreated,
        this.data,
        this.senderPubKey
    );
    
};


// ===============================================================================
// ========================= Sign A Transaction ==================================
// ===============================================================================
Transaction.prototype.signTransaction = function(privateKey) {
    return CryptoHashUtils.signData(this.calculateDataHash(), privateKey);
};


// ===============================================================================
// ========================= Verify Signature ====================================
// ===============================================================================
Transaction.prototype.verifySignature = function() {
    return CryptoHashUtils.verifySignature(this.transactionDataHash,
        this.senderPubKey, this.senderSignature);
};


// ===============================================================================
// ==================== GENESIS / FAUCET TRANSACTION =============================
// ===============================================================================
Transaction.genesisFaucetTransaction = function() {
    return new Transaction(
        "",                         // from Address
        Config.faucetAddress,       // to Address
        1000000000000,              // Faucet value
        10,                         // mining fee
        Config.genesisDate,         // date created
        Config.genesisDummyData,    // data
        Config.nullPublicKey,       // senderPubKey
        "",                         // transactionDataHash
        Config.nullPrivateKey,      // private key
        ""                          // senderSignature
    );
};


module.exports = Transaction;