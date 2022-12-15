const Blockchain = require("./Blockchain");
const CryptoHashUtils = require("./utils/CryptoHashUtils");

// Pseudo values for GENESIS / COINBASE TRANSACTIONS ===============================
const nodeValues = {
    from: "0000000000000000000000000000000000000000",
    senderPubKey: "00000000000000000000000000000000000000000000000000000000000000000",
    senderSignature: [
        "0000000000000000000000000000000000000000000000000000000000000000",
        "0000000000000000000000000000000000000000000000000000000000000000"
    ],
    senderPrivKey: "0000000000000000000000000000000000000000000000000000000000000000",
    minedInBlockIndex: 0,
    transferSuccessful: true
}

// TRANSACTION CONSTRUCTOR FUNCTION ========================================================
// =========================================================================================
function Transaction(to, value, fee, dateCreated, data, senderPubKey, senderPrivKey) {
    this.from = CryptoHashUtils.getAddressFromPublicKey(senderPubKey); // address from PubKey
    // if (!this.from) return CryptoHashUtils.getAddressFromPublicKey(senderPubKey);
    this.to = to; // Recipient address - 40 hex digits
    this.value = value; // Positive integer
    this.fee = fee; // Fee for miner (positive integer)
    this.dateCreated = dateCreated; // ISO8601 UTC datetime string (to avoid replay attacks)
    this.data = data; // Transaction data (payload/comments) - optional string
    this.senderPubKey = senderPubKey; // Sender public key – 65 hex digits
    this.transactionDataHash = this.calculateDataHash(); // 
    this.senderSignature = this.signTransaction(senderPrivKey);
    this.minedInBlockIndex = undefined;
    this.transferSuccessful = undefined;

    // Set Block index and transferSuccesful bool if Genesis Transaction
    // if (this.senderSignature === Blockchain.pendingTransactions[0].senderSignature) {
    //     this.minedInBlockIndex = 0;
    //     this.transferSuccessful = true;
    // }
}

// METHOD - Calculate Transaction Data Hash
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

// METHOD - Sign A Transaction
Transaction.prototype.signTransaction = function(privateKey) {
    return CryptoHashUtils.signData(this.calculateDataHash(), privateKey);
};

// METHOD - Verify Signature
Transaction.prototype.verifySignature = function() {
    return CryptoHashUtils.verifySignature(this.transactionDataHash,
        this.senderPubKey, this.senderSignature);
};

module.exports = Transaction;