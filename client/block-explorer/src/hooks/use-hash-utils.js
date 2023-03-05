// LIBRARIES
import secureLocalStorage from "react-secure-storage";
// HOOKS
import { useState } from "react";

var EC = require('elliptic').ec;
var secp256k1 = new EC('secp256k1');
const CryptoJS = require("crypto-js");


const useHashUtils = () => {
  // SHA-256
  const sha256 = (data) => {
    return CryptoJS.SHA256(data).toString();
  }
  
  // Sign transaction
  const signData = (data, privateKey) => {
    let keyPair = secp256k1.keyFromPrivate(privateKey);
    let signature = keyPair.sign(data);
  
    return [signature.r.toString(16), signature.s.toString(16)];
  }
  
  // Get Public Key 
  const getAddressFromPublicKey = (publicKey) => {
    let address = CryptoJS.RIPEMD160(publicKey).toString();
  
    return address;
  }

  // Calculate Transaction Data
  const calculateTxnData = (formData, publicKey, privateKey) => {

    console.log("UTILS DATA ======", formData);

    // Set txn data
    const transactionData = {
      from: getAddressFromPublicKey(publicKey),
      to: formData.recipient,
      value: +formData.amount,
      fee: 10,
      dateCreated: new Date().toISOString(),
      data: "VinyasaChain Transaction",
      senderPubKey: publicKey,
    }
    
    // Calculate/set dataHash & sender signature
    if (!transactionData.data) delete transactionData.data;
  
    let transactionDataJSON = JSON.stringify(transactionData).split(" ").join("");
  
    const dataHash = sha256(transactionDataJSON).toString();
    
    transactionData.transactionDataHash = dataHash;
    
    transactionData.senderSignature = signData(dataHash, privateKey);

    return transactionData;
  }

  return {
    sha256,
    signData,
    getAddressFromPublicKey,
    calculateTxnData
  }
}

export default useHashUtils;