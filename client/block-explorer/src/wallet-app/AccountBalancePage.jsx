import React from 'react'

const AccountBalancePage = () => {
  return (
    <div>AccountBalancePage</div>
  )
}

export default AccountBalancePage;








// import Head from "next/head";
// import MenuBar from "../../Components/Wallet/MenuBar";
// import { useState, useRef } from "react";
// import { useRecoilValue } from "recoil";
// import { lockState } from "../../recoil/atoms";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.min.css";
// import axios from "axios";

// export default function AccountBalancesPage() {

//   const [userAddress, setUserAddress] = useState("");
//   const [confirmedBalance, setConfirmedBalance] = useState("");
//   const [pendingBalance, setPendingBalance] = useState("");
//   const [safeBalance, setSafeBalance] = useState("");
//   const [safeCount, setSafeCount] = useState(0);
//   const [showDetails, setShowDetails] = useState(false);
//   const nodeUrl = "http://localhost:3001";

//   const handleClick = async () => {
//     console.log("handleClick");
//     if (!userAddress) {
//       toast.error("Please enter an address.", {
//         position: "bottom-right",
//         theme: "colored",
//       });
//       return;
//     }

//     const isValidAddress = /^[0-9a-f]{40}$/.test(userAddress);
//     if (!isValidAddress) {
//       toast.error("Invalid address.", {
//         position: "bottom-right",
//         theme: "colored",
//       });
//       return;
//     }

//     let [balances] = await Promise.all([
//       axios.get(`${nodeUrl}/address/${userAddress}/balance`),
//     ]);

//     console.log(balances);

//     const { confirmedBalance, pendingBalance, safeBalance, safeCount } =
//       balances.data;
//     setConfirmedBalance(confirmedBalance);
//     setPendingBalance(pendingBalance);
//     setSafeBalance(safeBalance);
//     setSafeCount(safeCount);
//     setShowDetails(true);
//   };

//   return (
//     <>
//       <Head>
//         <title>NOOB Wallet | Balances</title>
//       </Head>

//       <ToastContainer position="top-center" pauseOnFocusLoss={false} />
//       <MenuBar />
//       <div className="container ">
//         <h1 className="display-5 my-5">View Account Balance</h1>

//         <div className="d-flex align-items-between my-2">
//           <input
//             type="text"
//             className=" w-100 py-1"
//             placeholder="Enter your wallet address"
//             style={{ marginRight: "10px" }}
//             value={userAddress}
//             onChange={(e) => {
//               setUserAddress(e.target.value);
//             }}
//           />
//           <button
//             type="button"
//             className="btn btn-primary btn w-25"
//             onClick={handleClick}
//           >
//             Display Balance
//           </button>
//         </div>

//         {showDetails && (
//           <>
//             <div className="mt-5">
//               <h1 className="display-5">Balance Details</h1>
//             </div>

//             <hr />

//             <div className="container w-75" style={{ height: "28rem" }}>
//               <table className="table" style={{ maxWidth: "60rem" }}>
//                 <thead>
//                   <tr>
//                     <th scope="col">Status</th>
//                     <th scope="col">Balance</th>
//                     <th scope="col">Info</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   <tr>
//                     <td>Confirmed</td>
//                     <td>{confirmedBalance.toLocaleString("en-CA")}</td>
//                     <td>{`Your transactions have been mined and are on the blockchain.`}</td>
//                   </tr>
//                   <tr>
//                     <td>Safe</td>
//                     <td>{safeBalance.toLocaleString("en-CA")}</td>
//                     <td>{`These funds are considered safe once ${safeCount} additional blocks have been mined.`}</td>
//                   </tr>
//                   <tr>
//                     <td>Pending</td>
//                     <td>{pendingBalance.toLocaleString("en-CA")}</td>
//                     <td>{`These funds are currently waiting for the next block to be mined.`}</td>
//                   </tr>
//                 </tbody>
//               </table>

//               <div className="card text-center mt-4">
//                 <div className="card-header">Total Wallet Balance</div>
//                 <div className="card-body">
//                   <h1 className="display-5">
//                     {`${confirmedBalance.toLocaleString("en-CA")}`}
//                   </h1>
//                   <p className="card-text">NOOBS</p>
//                 </div>
//               </div>
//             </div>
//           </>
//         )}
//       </div>
//     </>
//   );
// }