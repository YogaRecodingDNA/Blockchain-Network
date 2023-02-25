// LIBRARIES
import secureLocalStorage from "react-secure-storage";
// HOOKS
import { useState } from "react";
// COMPONENTS
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


const OpenExistingWalletPage = () => {
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

export default OpenExistingWalletPage;


// Address: 1 ====================================================================================
// Generated random private key: d404f060542c67fc12f9c956d3b790ea04a667147d9976e214f60ce77b8136c4

// Extracted public key: 2bd656c2ad4db4b3a3b5323d71289edbc7b99ce71e41b0891e2bcd0716bf67b01

// Extracted blockchain address: f8752137e25ae836583c6d550b8469b12d9b7d8a
// Address: 1 ====================================================================================
// Generated random private key: e00f75d604005fce8bef9dad2c512a7416d56c45fce20af3428324f736dca31e

// Extracted public key: 2a90fa1391dac8d658fc771d159edec483cb3bc0c5349e6618ce92a57d03d29d0

// Extracted blockchain address: 0f386aa00e5e0097ec585dcf67044fe50f091bb6






















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














// import Head from "next/head";
// import { useState, useRef } from "react";
// import MenuBar from "../../Components/Wallet/MenuBar";
// import { useRecoilState } from "recoil";
// import { lockState, address } from "../../recoil/atoms";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.min.css";
// import elliptic from "../../lib/elliptic";
// import { saveKeysInSession } from "../../lib/session";

// export default function OpenExistingWalletPage() {
//   const [userPrivateKey, setUserPrivateKey] = useState("");
//   const [walletStatus, setWalletStatus] = useRecoilState(lockState);
//   const [walletAddress, setWalletAddress] = useRecoilState(address);

//   const textAreaRef = useRef("");
//   const secp256k1 = new elliptic.ec("secp256k1");

//   const handleClick = () => {
//     if (!userPrivateKey) {
//       toast.error("Please enter a private key.", {
//         position: "bottom-right",
//         theme: "colored",
//       });
//       return;
//     }

//     // if (userPrivateKey.length > 62) {
//     //   toast.error("Invalid Private Key.", {
//     //     position: "bottom-right",
//     //     theme: "colored",
//     //   });
//     //   return;
//     // }

//     let keyPair = secp256k1.keyFromPrivate(userPrivateKey);
//     saveKeysInSession(keyPair);

//     // display result
//     textAreaRef.current.value =
//       "Decoded existing private key: " +
//       sessionStorage["privKey"] +
//       "\n" +
//       "\n" +
//       "Extracted public key: " +
//       sessionStorage["pubKey"] +
//       "\n" +
//       "\n" +
//       "Extracted blockchain address: " +
//       sessionStorage["address"];

//     setWalletStatus("unlocked");
//     setWalletAddress(sessionStorage["address"]);

//     toast.success("Wallet successfully unlocked!", {
//       position: "bottom-right",
//       theme: "colored",
//     });
//   };

//   return (
//     <>
//       <Head>
//         <title>NOOB Wallet | Open Wallet</title>
//       </Head>

//       <ToastContainer position="top-center" pauseOnFocusLoss={false} />
//       <MenuBar />
//       <div className="container ">
//         <h1 className="display-5 my-5">Open Existing Wallet</h1>

//         <div className="d-flex align-items-between my-2">
//           <input
//             type="text"
//             className=" w-100 py-1"
//             placeholder="Enter your wallet private key (compressed ECDSA key, 256-bit integer, encoded as 64 hex digits)"
//             style={{ marginRight: "10px" }}
//             value={userPrivateKey}
//             onChange={(e) => {
//               setUserPrivateKey(e.target.value);
//             }}
//           />
//           <button
//             type="button"
//             value="Open Wallet"
//             className="btn btn-primary btn w-25"
//             onClick={handleClick}
//           >
//             Restore
//           </button>
//         </div>

//         <form>
//           <div className="form-group">
//             <textarea
//               ref={textAreaRef}
//               className="form-control"
//               rows="6"
//             ></textarea>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// }