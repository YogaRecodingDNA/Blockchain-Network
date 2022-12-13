const CryptoJS = require("crypto-js");
const EC = require('elliptic').ec;
const secp256k1 = new EC('secp256k1');

// SHA-256
function sha256(data) {
    return CryptoJS.SHA256(data).toString();
}

// Get Address from public key
function getAddressFromPublicKey(publicKey) {
    let address = CryptoJS.RIPEMD160(publicKey).toString();

    return address;
}

//  Get Public Key from private key
function getPublicKeyFromPrivateKey(privateKey) {
    let keyPair = secp256k1.keyFromPrivate(privateKey);
    let publicKey = keyPair.getPublic().getX().toString(16) +
    (keyPair.getPublic().getY().isOdd() ? "1" : "0");
    
    return publicKey;
}

// Get Address from private key
function getAddressFromPrivateKey(privateKey) {
    let publicKey = getPublicKeyFromPrivateKey(privateKey);
    let address = getAddressFromPublicKey(publicKey);

    return address;
}

// Decompress public key for signature verification
function decompressPublicKey(publicKeyCompressed) {
    let pubKeyX = publicKeyCompressed.substring(0, 64);
    let pubKeyYOdd = parseInt(publicKeyCompressed.substring(64));
    let pubKeyPoint = secp256k1.curve.pointFromX(pubKeyX, pubKeyYOdd);

    return pubKeyPoint;
}

// Sign transaction
function signData(data, privateKey) {
    let keyPair = secp256k1.keyFromPrivate(privateKey);
    let signature = keyPair.sign(data);

    return [signature.r.toString(16), signature.s.toString(16)];
}

// Verify signature
function verifySignature(data, publicKey, signature) {
    let publicKeyPoint = decompressPublicKey(publicKey);
    let keyPair = secp256k1.keyPair({pub: publicKeyPoint});
    let valid = keyPair.verify(data, {r: signature[0], s: signature[1]});

    return valid;
}

// Create unique ID
function createId() {
    return (new Date()).getTime().toString(16) + Math.random().toString(16).substring(2);
}


module.exports = {
    sha256,
    getAddressFromPublicKey,
    getPublicKeyFromPrivateKey,
    getAddressFromPrivateKey,
    signData,
    verifySignature,
    createId
};