// LIBRARIES
import secureLocalStorage from "react-secure-storage";
// HOOKS
import { useState } from "react";
// COMPONENTS
import WalletHeader from "../components/WalletHeader";
import Button from "../../components/Button";
// ASSETS/ICONS/STATUS COMPONENTS
import wavePattern2 from "../../assets/images/wavePattern2.jpeg";
import { GiWallet } from "react-icons/gi";

var EC = require('elliptic').ec;
var secp256k1 = new EC('secp256k1');
const CryptoJS = require("crypto-js");

const openWallet = (privateKey) => {
  secureLocalStorage.clear();
  const keyPair = secp256k1.keyFromPrivate(privateKey);
  const publicKey =
    keyPair.getPublic().getX().toString(16) +
    (keyPair.getPublic().getY().isOdd() ? "1" : "0");
  const address = CryptoJS.RIPEMD160(publicKey).toString();

  return {
    privateKey,
    publicKey,
    address
  }
}


const OpenExistingWalletPage = () => {
  const [ formInputs, setFormInputs ] = useState({});
  const [ generatedData, setGeneratedData ] = useState("")
  const [ isLoggedIn, setIsLoggedIn ] = useState(secureLocalStorage.getItem("loggedIn"));
  const [ isActiveWallet, setIsActiveWallet ] = useState(secureLocalStorage.getItem("address"));

  window.addEventListener('secureLocalStorage', () => {
    setIsLoggedIn(secureLocalStorage.getItem("loggedIn"));
    setIsActiveWallet(secureLocalStorage.getItem("address"));
  });
  
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormInputs(values => ({...values, [name]: value}));
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const target = event.target;
    secureLocalStorage.clear();

    const wallet = openWallet(formInputs.privateKey);
    console.log("NEW WALLET ======= ", wallet)

    secureLocalStorage.setItem("privKey", wallet.privateKey);
    secureLocalStorage.setItem("pubKey", wallet.publicKey);
    secureLocalStorage.setItem("address", wallet.address);
    secureLocalStorage.setItem("loggedIn", true);

    window.dispatchEvent(new Event("secureLocalStorage"));
    
    setGeneratedData(
      "Decoded existing private key: " +
      "\n" +
      wallet.privateKey +
      "\n" +
      "\n" +
      "Extracted public key: " +
      "\n" +
      wallet.publicKey +
      "\n" +
      "\n" +
      "Extracted blockchain address: " +
      "\n" +
      wallet.address
    );

    target.reset();
  
  }

  return (
    <div className="bg-cover bg-fixed w-full h-full" style={{ backgroundImage: `url(${wavePattern2})`}}>
      <WalletHeader login={isLoggedIn} />
      <div className="flex bg-gradient-to-b from-gray-900 via-transparent justify-center items-start w-full h-full text-white">
          <div className="flex justify-center w-2/3 h-max mx-auto my-10 px-5 space-y-4 rounded-lg">
            <div className="overflow-x-auto w-full h-max px-5 py-5 rounded-lg border border-gray-700 bg-gray-900/60 shadow-md lg:w-3/5">
              <div className="flex items-center">
                <h1 className="w-full h-10 text-2xl font-normal">
                Open An Existing Wallet
                </h1>
              </div>
              <p className="ml-0 mt-3 text-sm text-gray-300">Enter your wallet's private key (conpressed ECDSA key, 65 hex digits):</p>
              <form onSubmit={handleSubmit} className="mt-5 space-y-6">
                <div className="space-y-5 rounded-md shadow-sm">
                  <div>
                  <label htmlFor="private-key" className="sr-only">
                      Private Key
                    </label>
                    <input
                      type="text"
                      id="private-key"
                      name="privateKey"
                      onChange={handleChange}
                      autoComplete="off"
                      required
                      className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="Private key..."
                    />
                  </div>
                  <div>
                  <Button
                    submit
                    type="submit"
                  >
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <GiWallet className="ml-5 h-6 w-6 text-indigo-800" aria-hidden="true" />
                    </span>
                    Open Wallet
                  </Button>
                </div>
                  <div>
                    <textarea
                      type="text"
                      id="wallet"
                      name="wallet"
                      value={generatedData && generatedData}
                      onChange={e => setGeneratedData(e.target.value)}
                      className="relative block w-full h-56 appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-sm "
                      placeholder={"Wallet Info..."}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
      </div>
    </div>
  )
}

export default OpenExistingWalletPage;


// Address: 1 ====================================================================================
// Generated random private key: d404f060542c67fc12f9c956d3b790ea04a667147d9976e214f60ce77b8136c4

// Extracted public key: 2bd656c2ad4db4b3a3b5323d71289edbc7b99ce71e41b0891e2bcd0716bf67b01

// Extracted blockchain address: f8752137e25ae836583c6d550b8469b12d9b7d8a
// Address: 1 ====================================================================================
// Generated random private key: e00f75d604005fce8bef9dad2c512a7416d56c45fce20af3428324f736dca31e

// Extracted public key: 2a90fa1391dac8d658fc771d159edec483cb3bc0c5349e6618ce92a57d03d29d0

// Extracted blockchain address: 0f386aa00e5e0097ec585dcf67044fe50f091bb6