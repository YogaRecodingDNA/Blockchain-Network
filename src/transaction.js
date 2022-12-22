const Config = require("./utils/Config");
const CryptoHashUtils = require("./utils/CryptoHashUtils");

// ===============================================================================
// ======================= TRANSACTION CONSTRUCTOR ===============================
// ===============================================================================
// !!!Sending Private Key for testing purposes only!!!!!!
function Transaction(to, value, fee, dateCreated, data, senderPubKey, senderPrivKey) {
    this.from = CryptoHashUtils.getAddressFromPublicKey(senderPubKey);// address from PubKey
    this.to = to;                       // Recipient address - 40 hex digits
    this.value = value;                 // Positive integer
    this.fee = fee;                     // Fee for miner (positive integer)
    this.dateCreated = dateCreated;     // ISO8601 UTC datetime string (to avoid replay attacks)
    this.data = data;                   // Transaction data (payload/comments) - optional string
    this.senderPubKey = senderPubKey;   // Sender public key – 65 hex digits
    if (senderPubKey === undefined) {
        this.senderPubKey = Config.nullPublicKey;
    }
    this.transactionDataHash = this.calculateDataHash(); 
    this.senderSignature = this.signTransaction(senderPrivKey);
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
    const transactionData = {
        from: this.from,
        to: this.to,
        value: this.value,
        fee: this.fee,
        dateCreated: this.dateCreated,
        data: this.data,
        senderPubKey: this.senderPubKey
    };
    if (!transactionData.data) delete transactionData.data;
    const transactionDataJSON = JSON.stringify(transactionData).split(" ").join("");
    return CryptoHashUtils.sha256(transactionDataJSON).toString();
};


// ===============================================================================
// ========================= Sign A Transaction ==================================
// ===============================================================================
Transaction.prototype.signTransaction = function(privateKey) {
    if (privateKey === undefined) privateKey = Config.nullPrivateKey; ;
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
        Config.faucetAddress,       // to Address
        1000000000000,              // Faucet value
        10,                         // mining fee
        Config.genesisDate,         // date created
        Config.genesisDummyData,    // data
        Config.nullPublicKey,       //senderPubKey
        Config.nullPrivateKey       // private key
    );
};


module.exports = Transaction;