const Block = require("../src/block");

describe('Block', () => {
    const index = 99; 
    const transactions = [
        {
        from: "JFHOQIE57034GHQP40894HP",
        to: "209834TSEJKFGNQ03U94T0Q",
        value: 74,
        fee: 0.0006,
        dateCreated: 1669611445361,
        data: "genesis tx",
        senderPubKey: "984I3BRLSKRJGHQ384UTHQPUIR",
        transactionDataHash: "Q984TQ03HU5087HQ0WPAUG",
        senderSignature: "2904580UHG024587H0GW85GW0QAQ",
        minedInBlockIndex: 543,
        transferSuccessful: true
    },
        {
        from: "JFHOQIE57034GHQP40894HP",
        to: "209834TSEJKFGNQ03U94T0Q",
        value: 15,
        fee: 0.0007,
        dateCreated: 1669611445361,
        data: "arbitrary",
        senderPubKey: "984I3BRLSKRJGHQ384UTHQPUIR",
        transactionDataHash: "Q984TQ03HU5087HQ0WPAUG",
        senderSignature: "2904580UHG024587H0GW85GW0QAQ",
        minedInBlockIndex: 987,
        transferSuccessful: false
    }
    ]; 
    const difficulty = 5; 
    const prevBlockHash = "029438HPWIOERG20398GH"; 
    const minedBy = "2048750ASURVQ0487HHW85Q4FY8"; 
    const blockDataHash = "09Q3840PQWRJNSOHFIH205W89GHW"; 
    const nonce = 90875; 
    const dateCreated = 1669611445361; 
    const blockHash = "29085HGSOITBH0W8547HW0T8UHW0";

    const block = new Block({ index, transactions, difficulty, prevBlockHash, minedBy, blockDataHash, nonce, dateCreated, blockHash });

    it('has an "index" property', () => {
        expect(block.index).toEqual(index);
    });

    it('has a "transactions" property', () => {
        expect(block.transactions).toEqual(transactions);
    });

    it('has a "difficulty" property', () => {
        expect(block.difficulty).toEqual(difficulty);
    });

    it('has a "prevBlockHash" property', () => {
        expect(block.prevBlockHash).toEqual(prevBlockHash);
    });

    it('has a "minedBy" property', () => {
        expect(block.minedBy).toEqual(minedBy);
    });

    it('has a "blockDataHash" property', () => {
        expect(block.blockDataHash).toEqual(blockDataHash);
    });

    it('has a "nonce" property', () => {
        expect(block.nonce).toEqual(nonce);
    });

    it('has a dateCreated property', () => {
        expect(block.dateCreated).toEqual(dateCreated);
    });

    it('has a "blockHash" property', () => {
        expect(block.blockHash).toEqual(blockHash);
    });
});