const CryptoHashUtils = require("./utils/CryptoHashUtils");

// Transaction constructor function
function Transaction(from, to, value, fee, dateCreated, data, senderPubKey, transactionDataHash, senderSignature, minedInBlockIndex, transferSuccessful) {
    this.from = from;
    this.to = to;
    this.value = value;
    this.fee = fee;
    this.dateCreated = dateCreated;
    this.data = data;
    this.senderPubKey = senderPubKey;
    this.transactionDataHash = transactionDataHash;
        // Calculate hash if not present
    if (transactionDataHash === undefined) this.calculateTransactionDataHash();

    this.senderSignature = senderSignature;
    this.minedInBlockIndex = minedInBlockIndex;
    this.transferSuccessful = transferSuccessful;
}

// Method - Calculate Transaction Data Hash
Transaction.prototype.calculateTransactionDataHash = function() {
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

    const transactionDataJSON = JSON.stringify(transactionData);

    this.transactionDataHash = CryptoHashUtils.sha256(transactionDataJSON).toString();
};

// Method - Sign A Transaction
Transaction.prototype.signTransaction = function(privateKey) {
    this.senderSignature = CryptoHashUtils.signData(
        this.transactionDataHash, privateKey);
};

// Method - Verify Signature
Transaction.prototype.verifySignature = function() {
    return CryptoUtils.verifySignature(this.transactionDataHash,
        this.senderPubKey, this.senderSignature);
};


module.exports = Transaction;