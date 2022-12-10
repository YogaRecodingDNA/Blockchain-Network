const isMissing_FieldKeys = (transactionData) => {
    const expectedFields = ["to", "value", "fee", "data", "senderPubKey", "senderPrivKey"];
    let incomingFields = [];
    for (const field in transactionData) {
        incomingFields.push(field);
    }

    let missingFields = [];
    expectedFields.forEach( field => {
        if (!incomingFields.includes(field)) missingFields.push(field);
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
    for (const field in transactionData) {
        incomingFields.push(field);
    }

    let missingFields = [];
    let invalidFields = [];
    incomingFields.forEach((field, index) => {
        const missingField = field !== validFields[index];
        if (missingField) missingFields.push(missingField);
        
        const isValidField = field !== validFields[index]? false : true;
        if (!isValidField) invalidFields.push([field, isValidField]);
    });
    
    if (invalidFields.length >= 1) {
        return invalidFields.filter(field => field[1] === false)
                    .map(field => `Invalid field - '${field[0]}'`);
    } else {
        return false;
    }
}

module.exports = {
    isMissing_FieldKeys,
    isValid_FieldKeys
}