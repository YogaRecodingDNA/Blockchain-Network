// LIBRARIES
import  secureLocalStorage  from  "react-secure-storage";
import generateKeys from "../lib/session";
// HOOKS
import { useState } from "react";
// COMPONENTS
import Button from "../components/Button";
import WalletHeader from "./components/WalletHeader";
// ASSETS/ICONS/STATUS COMPONENTS
import wavePattern2 from "../assets/images/wavePattern2.jpeg";
import { GiWallet } from "react-icons/gi";

var EC = require('elliptic').ec;
var secp256k1 = new EC('secp256k1');


const CreateNewWalletPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [generatedData, setGeneratedData] = useState("")
  
  const handleLogin = () => {
    setIsLoggedIn(!isLoggedIn);

    if (isLoggedIn === false) {
      setGeneratedData("");
      secureLocalStorage.clear();
    }
  }

  const handleClick = () => {
    let newKeyPair = secp256k1.genKeyPair();
  
    const newWallet = generateKeys(newKeyPair);
    console.log("NEW WALLET ======= ", newWallet)

    secureLocalStorage.setItem("privKey", newWallet.privateKey);
    secureLocalStorage.setItem("pubKey", newWallet.publicKey);
    secureLocalStorage.setItem("address", newWallet.address);
    
    setGeneratedData(
      "Generated random private key: " +
      newWallet.privateKey +
      "\n" +
      "\n" +
      "Extracted public key: " +
      newWallet.publicKey +
      "\n" +
      "\n" +
      "Extracted blockchain address: " +
      newWallet.address
    );
  
  }

  return (
    <div className="bg-cover bg-fixed w-full h-full" style={{ backgroundImage: `url(${wavePattern2})`}}>
      <WalletHeader isLoggedIn={isLoggedIn} />
      <div className="flex bg-gradient-to-b from-gray-900 via-transparent justify-center items-start w-full h-full text-white">
          <div className="w-2/3 h-max mx-auto my-10 px-5 space-y-4 rounded-lg">
            <div className="overflow-x-auto w-full h-max px-5 py-5 rounded-lg border border-gray-700 bg-gray-900/60 shadow-md">
              <div className="flex items-center">
                <h1 className="w-full h-10 ml-4 text-2xl font-normal">
                  Create a New Wallet
                </h1>
                <Button
                  secondary
                  onClick={handleLogin}
                  className={isLoggedIn ? "bg-gradient-to-r from-rose-700 via-red-400 to-orange-500 hover:bg-gradient-to-r hover:from-yellow-300 hover:via-red-500 hover:to-rose-500" : ""}
                >
                  { isLoggedIn ? "Logout" : "Login" }
                </Button>
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
                  <button
                    type="button"
                    onClick={handleClick}
                    className="group relative flex w-full justify-center rounded-md border border border-indigo-600 py-2 px-4 text-sm font-medium text-white bg-gradient-to-r from-cyan-700 to-teal-400 hover:from-sky-400 hover:to-violet-500 text-white drop-shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <GiWallet className="ml-5 h-6 w-6 text-indigo-800" aria-hidden="true" />
                    </span>
                    Generate Now
                  </button>
                </div>}
              </div>
              
            </div>
          </div>
      </div>
    </div>
  )
}

export default CreateNewWalletPage;























// import Head from "next/head";
// import { useRef, useState } from "react";
// import MenuBar from "../../Components/Wallet/MenuBar";
// import elliptic from "../../lib/elliptic";
// import { useRecoilState } from "recoil";
// import { lockState, address } from "../../recoil/atoms.js";
// import { saveKeysInSession } from "../../lib/session";

// export default function CreateNewWalletPage() {
//   const [walletStatus, setWalletStatus] = useRecoilState(lockState);
//   const [walletAddress, setWalletAddress] = useRecoilState(address);
//   const [isCreated, setIsCreated] = useState(false);

//   const secp256k1 = new elliptic.ec("secp256k1");
//   const textAreaRef = useRef("");

//   const handleClick = () => {
//     let keyPair = secp256k1.genKeyPair();
//     saveKeysInSession(keyPair);
//     // display result
//     textAreaRef.current.value =
//       "Generated random private key: " +
//       sessionStorage["privKey"] +
//       "\n" +
//       "\n" +
//       "Extracted public key: " +
//       sessionStorage["pubKey"] +
//       "\n" +
//       "\n" +
//       "Extracted blockchain address: " +
//       sessionStorage["address"];

//     setIsCreated(true);
//     setWalletStatus("unlocked");
//     setWalletAddress(sessionStorage["address"]);
//   };

//   return (
//     <>
//       <Head>
//         <title>NOOB Wallet | New Wallet</title>
//       </Head>

//       <MenuBar />

//       <div className="container">
//         <h1 className="display-5 my-5">Create a New Wallet</h1>

//         <form>
//           <div className="form-group">
//             <textarea
//               className="form-control"
//               rows="5"
//               ref={textAreaRef}
//             ></textarea>
//           </div>
//           {!isCreated ? (
//             <button
//               type="button"
//               value="Generate Now"
//               className="btn btn-primary btn mt-3 w-100"
//               onClick={handleClick}
//             >
//               Generate Now
//             </button>
//           ) : (
//             <button
//               type="button"
//               value="Generate Now"
//               className="btn btn-primary btn mt-3 w-100"
//               disabled
//             >
//               Wallet Created Successfully!
//             </button>
//           )}
//         </form>
//       </div>
//     </>
//   );
// }