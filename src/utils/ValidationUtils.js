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
    console.log("Signature isValid_0 ====== ", isValid_0);
    const isValid_1 = /[A-Fa-f0-9]{64}/g.test(signature[1]);
    console.log("Signature isValid_1 ====== ", isValid_1);
    const isValid = isValid_0 && isValid_1;
    console.log("Signature isValid ====== ", isValid);
    return isValid;
}

const isValidBlockIndex = (index, previousBlockIndex) => {
    if (typeof index !== "number") return false;
    if (!Number.isInteger(index)) return false;
    return index === previousBlockIndex + 1;
}

const isValidDifficulty = (difficulty, previousDifficulty) => {
    if (typeof difficulty !== "number") return false;
    if (!Number.isInteger(difficulty)) return false;
    return difficulty >= 5;
}

const isValidNonce = (nonce) => {
    if (typeof nonce !== "number") return false;
    if (!Number.isInteger(nonce)) return false;
    return nonce > 0;
}

const isoDateRegEx =
    /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}\.[0-9]{2,6}Z$/;

function isValidDate(dateISO) {
    if (typeof(dateISO) !== "string")
        return false;
    if (! isoDateRegEx.test(dateISO))
        return false;
    let date = new Date(dateISO);
    if (isNaN(date))
        return false;
    let year = date.getUTCFullYear();
    return (year >= 2022) && (year <= 2100);
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

const isMissing_FieldKeys = (dataObject) => {

    function calculateMissingFields(expectedFields) {
        let incomingFields = [];
        for (const field in dataObject) {
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

    if (dataObject.blockHash) {
        const expectedFields = ["index", "transactions", "difficulty", "prevBlockHash", "minedBy", "blockDataHash", "nonce", "dateCreated", "blockHash"];

        calculateMissingFields(expectedFields);
        
    } else if (dataObject.transactionDataHash) {
        const expectedFields = ["from", "to", "value", "fee", "dateCreated", "data", "senderPubKey", "transactionDataHash", "senderSignature", "minedInBlockIndex", "transferSuccessful"];
        
        calculateMissingFields(expectedFields);
        
    } else {
        const expectedFields = ["to", "value", "fee", "data", "senderPubKey", "senderPrivKey"];
        
        calculateMissingFields(expectedFields);
        
    }
}

const isValid_FieldKeys = (dataObject) => {
    if (dataObject.blockHash) {
        const validFields = ["index", "transactions", "difficulty", "prevBlockHash", "minedBy", "blockDataHash", "nonce", "dateCreated", "blockHash"];

        calculateValidFields(validFields);
        
    } else if (dataObject.transactionDataHash) {
        const validFields = ["from", "to", "value", "fee", "dateCreated", "data", "senderPubKey", "transactionDataHash", "senderSignature", "minedInBlockIndex", "transferSuccessful"];
        
        calculateValidFields(validFields);
        
    } else {
        const validFields = ["to", "value", "fee", "data", "senderPubKey", "senderPrivKey"];

        calculateValidFields(validFields);
    }

    function calculateValidFields(validFields) {
        let incomingFields = [];
        for (const field in dataObject) { // iterate dataObject object
            incomingFields.push(field);
        }
    
        let invalidFields = [];
        incomingFields.forEach((incoming, index) => {
            const isValidField = (incoming !== validFields[index]) ? false : true;
            if (!isValidField) invalidFields.push([incoming, isValidField]);
        });
    
        // invalidFields -->  [ ["str", bool], ["str", bool] ]   <-- array of arrays
        if (invalidFields.length >= 1) {
            return invalidFields.filter(invalid => invalid[1] === false) // if index 1 is false
                        .map(invalid => `Invalid field - '${invalid[0]}'`); // return the false "str"
        } else {
            return false;
        }
    }
}

module.exports = {
    isValidAddress,
    isValidPublicKey,
    isValidPrivateKey,
    isValidSignature,
    isValidTransferValue,
    isValidTransferFee,
    isValidBlockIndex,
    isValidDifficulty,
    isValidNonce,
    isValidDate,
    isMissing_FieldKeys,
    isValid_FieldKeys
}