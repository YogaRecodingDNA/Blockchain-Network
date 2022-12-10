const CryptoHashUtils = require("./utils/CryptoHashUtils");

// Transaction constructor function
function Transaction(to, value, fee, dateCreated, data, senderPubKey, senderPrivKey) {
    this.from = CryptoHashUtils.getAddressFromPublicKey(senderPubKey); // Sender address derived from senderPubKey
    this.to = to; // Recipient address - 40 hex digits
    this.value = value; // Positive integer
    this.fee = fee; // Fee for miner (positive integer)
    this.dateCreated = dateCreated; // ISO8601 UTC datetime string (to avoid replay attacks)
    this.data = data; // Transaction data (payload/comments) - optional string
    this.senderPubKey = senderPubKey; // Sender public key – 65 hex digits
    this.transactionDataHash = "";

    this.senderSignature = this.signTransaction(senderPrivKey);

    this.minedInBlockIndex = "pending";
    this.transferSuccessful = "pending";
}

// Method - Calculate Transaction Data Hash
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

// Method - Sign A Transaction
Transaction.prototype.signTransaction = function(privateKey) {
    return CryptoHashUtils.signData(this.calculateDataHash(), privateKey);
};

// Method - Verify Signature
Transaction.prototype.verifySignature = function() {
    return CryptoUtils.verifySignature(this.transactionDataHash,
        this.senderPubKey, this.senderSignature);
};


module.exports = Transaction;