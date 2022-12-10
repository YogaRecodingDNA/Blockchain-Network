const Config = require("./Config");

const isValidAddress = (address) => {
    if (typeof (address) !== "string") return false;
    const isValid = /[A-Fa-f0-9]{40}/g.test(address);
    return isValid;
}

const isValidPublicKey = (publicKey) => {
    if (typeof (publicKey) !== "string") return false;
    const isValid = /[A-Fa-f0-9]{65}/g.test(publicKey);
    return isValid;
}

const isValidPrivateKey = (privateKey) => {
    if (typeof (privateKey) !== "string") return false;
    const isValid = /[A-Fa-f0-9]{64}/g.test(privateKey);
    return isValid;
}

const isValidSignature = (signature) => {
    if (!Array.isArray(signature)) return false;
    if (signature.length !== 2) return false;
    const isValid_0 = /[A-Fa-f0-9]{64}/g.test(signature[0]);
    const isValid_1 = /[A-Fa-f0-9]{64}/g.test(signature[1]);
    const isValid = isValid_0 && isValid_1;
    return isValid;
}

const isValidTransferValue = (value) => {
    if (typeof value !== "number") return false;
    if (!Number.isInteger(value)) return false;
    return value >= 0;
}

const isValidTransferFee = (fee) => {
    if (typeof fee !== "number") return false;
    if (!Number.isInteger(fee)) return false;
    return fee >= Config.minimumTransactionFee;
}

const isMissing_FieldKeys = (transactionData) => {
    const expectedFields = ["to", "value", "fee", "data", "senderPubKey", "senderPrivKey"];
    let incomingFields = [];
    for (const field in transactionData) {
        incomingFields.push(field);
    }

    let missingFields = [];
    expectedFields.forEach( expected => {
        if (!incomingFields.includes(expected)) missingFields.push(expected);
    });
    
    if (missingFields.length >= 1) {
        return missingFields.map(field => `Missing field - '${field}'`);
    } else {
        return false;
    }
}

const isValid_FieldKeys = (transactionData) => {
    const validFields = ["to", "value", "fee", "data", "senderPubKey", "senderPrivKey"];
    let incomingFields = [];
    for (const field in transactionData) { // iterate transactionData object
        incomingFields.push(field);
    }

    let invalidFields = [];
    incomingFields.forEach((incoming, index) => {
        const isValidField = (incoming !== validFields[index]) ? false : true;
        if (!isValidField) invalidFields.push([incoming, isValidField]);
    });

    // invalidFields =  [ ["str", bool], ["str", bool] ]   <-- array of arrays
    if (invalidFields.length >= 1) {
        return invalidFields.filter(invalid => invalid[1] === false) // if index 1 is false
                    .map(invalid => `Invalid field - '${invalid[0]}'`); // return the false "str"
    } else {
        return false;
    }
}

module.exports = {
    isValidAddress,
    isValidPublicKey,
    isValidPrivateKey,
    isValidSignature,
    isValidTransferValue,
    isValidTransferFee,
    isMissing_FieldKeys,
    isValid_FieldKeys
}