// import hashes from "./hashes";
const CryptoJS = require("crypto-js");

const generateKeys = (keyPair) => {
  let privateKey;
  let publicKey;
  let address;

  privateKey = keyPair.getPrivate().toString(16);
  let pubKey =
    keyPair.getPublic().getX().toString(16) +
    (keyPair.getPublic().getY().isOdd() ? "1" : "0");
  publicKey = pubKey;
  address = CryptoJS.RIPEMD160(pubKey).toString();

  return {
    privateKey,
    publicKey,
    address
  }
};

export default generateKeys;