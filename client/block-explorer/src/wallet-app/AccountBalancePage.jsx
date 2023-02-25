// LIBRARIES
import secureLocalStorage from "react-secure-storage";
// HOOKS
import { useState } from "react";
// COMPONENTS
// import Button from "../components/Button";
import WalletHeader from "./components/WalletHeader";
// ASSETS/ICONS/STATUS COMPONENTS
import wavePattern2 from "../assets/images/wavePattern2.jpeg";
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


const AccountBalancePage = () => {
  const [formInputs, setFormInputs] = useState({});
  const [generatedData, setGeneratedData] = useState("")
  
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormInputs(values => ({...values, [name]: value}));
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const target = event.target;

    const wallet = openWallet(formInputs.privateKey);
    console.log("NEW WALLET ======= ", wallet)

    secureLocalStorage.setItem("privKey", wallet.privateKey);
    secureLocalStorage.setItem("pubKey", wallet.publicKey);
    secureLocalStorage.setItem("address", wallet.address);
    
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
      <WalletHeader />
      <div className="flex bg-gradient-to-b from-gray-900 via-transparent justify-center items-start w-full h-full text-white">
          <div className="w-2/3 h-max mx-auto my-10 px-5 space-y-4 rounded-lg">
            <div className="overflow-x-auto w-full h-max px-5 py-5 rounded-lg border border-gray-700 bg-gray-900/60 shadow-md">
              <div className="flex items-center">
                <h1 className="w-full h-10 text-2xl font-normal">
                Open An Existing Wallet
                </h1>
                {/* <Button
                  secondary
                  onClick={handleLogin}
                  className={isLoggedIn ? "bg-gradient-to-r from-rose-700 via-red-400 to-orange-500 hover:bg-gradient-to-r hover:from-yellow-300 hover:via-red-500 hover:to-rose-500" : ""}
                >
                  { isLoggedIn ? "Logout" : "Login" }
                </Button> */}
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
                  <button
                    type="submit"
                    className="group relative flex w-full justify-center rounded-md border border border-indigo-600 py-2 px-4 text-sm font-medium text-white bg-gradient-to-r from-cyan-700 to-teal-400 hover:from-sky-400 hover:to-violet-500 text-white drop-shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <GiWallet className="ml-5 h-6 w-6 text-indigo-800" aria-hidden="true" />
                    </span>
                    Open Wallet
                  </button>
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

export default AccountBalancePage;