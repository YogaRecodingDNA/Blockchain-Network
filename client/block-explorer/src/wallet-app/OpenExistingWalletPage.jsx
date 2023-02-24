import React from 'react'

const OpenExistingWalletPage = () => {
  return (
    <div>OpenExistingWalletPage</div>
  )
}

export default OpenExistingWalletPage;

















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