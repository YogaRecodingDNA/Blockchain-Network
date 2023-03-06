// LIBRARIES
import secureLocalStorage from "react-secure-storage";
import { useNavigate } from "react-router-dom";
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

const generateNewWallet = (keyPair) => {
  const privateKey = keyPair.getPrivate().toString(16);
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

const CreateNewWalletPage = () => {
  const [ isLoggedIn, setIsLoggedIn ] = useState(secureLocalStorage.getItem("loggedIn"));
  const [ isActiveWallet, setIsActiveWallet ] = useState(secureLocalStorage.getItem("address"));
  const [ generatedData, setGeneratedData ] = useState("");
  const navigate = useNavigate();

  window.addEventListener('secureLocalStorage', () => {
    setIsLoggedIn(secureLocalStorage.getItem("loggedIn"));
    setIsActiveWallet(secureLocalStorage.getItem("address"));
  });

  const handleClick = () => {
    
    let newKeyPair = secp256k1.genKeyPair();
    
    const newWallet = generateNewWallet(newKeyPair);
    console.log("NEW WALLET ======= ", newWallet)
    
    secureLocalStorage.setItem("privKey", newWallet.privateKey);
    secureLocalStorage.setItem("pubKey", newWallet.publicKey);
    secureLocalStorage.setItem("address", newWallet.address);
    
    window.dispatchEvent(new Event("secureLocalStorage"));
    
    setGeneratedData(
      "PRIVATE KEY: " +
      newWallet.privateKey +
      "\n" +
      "\n" +
      "PUBLIC KEY: " +
      newWallet.publicKey +
      "\n" +
      "\n" +
      "BLOCKCHAIN ADDRESS: " +
      newWallet.address
    );
  
  }

  return (
    <div className="bg-cover bg-fixed w-full h-full" style={{ backgroundImage: `url(${wavePattern2})`}}>
      <WalletHeader login={isLoggedIn} />
      <div className="flex bg-gradient-to-b from-gray-900 via-transparent justify-center items-start w-full h-full text-white">
          <div className="flex justify-center w-2/3 h-max mx-auto my-10 px-5 space-y-4 rounded-lg">
            <div className="overflow-x-auto w-full h-max px-5 py-5 rounded-lg border border-gray-700 bg-gray-900/60 shadow-md lg:w-3/5">
              <div className="flex items-center">
                <h1 className="w-full h-10 ml-4 text-2xl font-normal">
                  Create a New Wallet
                </h1>
              </div>
              <p className="ml-4 text-sm text-gray-300">Generate a new wallet: random private key | public key | address</p>
              <div className="mt-5 space-y-6">
                <div className="space-y-5 rounded-md shadow-sm">
                  <div>
                    <textarea
                      type="text"
                      id="recipient-address"
                      name="recipient"
                      value={isLoggedIn ? generatedData && generatedData : ""}
                      onChange={e => setGeneratedData(e.target.value)}
                      required
                      className="relative block w-full h-56 appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-sm "
                      placeholder={isLoggedIn ? "Wallet Info..." : "!!! MUST LOGIN TO GENERATE A NEW WALLET !!!"}
                    />
                  </div>
                </div>

                {isLoggedIn && 
                <div>
                  <Button
                    submit
                    type="button"
                    onClick={handleClick}
                  >
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <GiWallet className="ml-5 h-6 w-6 text-indigo-800" aria-hidden="true" />
                    </span>
                    Generate Now
                  </Button>
                </div>}
                {!isLoggedIn &&
                <div>
                  <Button
                    warning
                    type="button"
                    onClick={() => navigate("/wallet")}
                  >
                    Go to login page
                  </Button>
                </div>}
              </div>
              
            </div>
          </div>
      </div>
    </div>
  )
}

export default CreateNewWalletPage;
