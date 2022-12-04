const Transaction = require("../src/transaction");

describe("Transaction", () => {

    const from = "c3293572dbe6ebc60de4a20ed0e21446cae66b17";
    const to = "f51362b7351ef62253a227a77751ad9b2302f911";
    const value = 25000;
    const fee = 10;
    const dateCreated = "2022-01-01T00:00:000Z";
    const data = "funds";
    const senderPubKey = "c74a8458cd7a7e48f4b7ae6f4ae9f56c5c88c0f03e7c59cb4132b9d9d1600bba1";
    const transactionDataHash = "6a3a7859c389bad17d79c5856e17a74daecfa6d67aab237132b5dc8849b5467e";
    const senderSignature = [
        "33be705476889fbb647633a9272cf546401f22e87f0c2b2a6c58ff56b7aa368a",
        "66722e9b58a05952a986ee2c90faa1cc828575503cfc393278006629f20bd78c"
    ];
    const minedInBlockIndex = 4;
    const transferSuccessful = true;

    const transaction = new Transaction({ from, to, value, fee, dateCreated, data, senderPubKey, transactionDataHash, senderSignature, minedInBlockIndex, transferSuccessful });

    it('has a "from" property', () => {
        expect(transaction.from).toEqual(from);
    });
    it('has a "to" property', () => {
        expect(transaction.to).toEqual(to);
    });
    it('has a "value" property', () => {
        expect(transaction.value).toEqual(value);
    });
    it('has a "fee" property', () => {
        expect(transaction.fee).toEqual(fee);
    });
    it('has a "dateCreated" property', () => {
        expect(transaction.dateCreated).toEqual(dateCreated);
    });
    it('has a "data" property', () => {
        expect(transaction.data).toEqual(data);
    });
    it('has a "senderPubKey" property', () => {
        expect(transaction.senderPubKey).toEqual(senderPubKey);
    });
    it('has a "transactionDataHash" property', () => {
        expect(transaction.transactionDataHash).toEqual(transactionDataHash);
    });
    it('has a "senderSignature" property', () => {
        expect(transaction.senderSignature).toEqual(senderSignature);
    });
    it('has a "minedInBlockIndex" property', () => {
        expect(transaction.minedInBlockIndex).toEqual(minedInBlockIndex);
    });
    it('has a "transferSuccessful" property', () => {
        expect(transaction.transferSuccessful).toEqual(transferSuccessful);
    });
    

});