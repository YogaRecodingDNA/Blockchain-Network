// LIBRARIES
import secureLocalStorage from "react-secure-storage";
// HOOKS
import { useState } from "react";
import useHashUtils from "../../hooks/use-hash-utils";
import { useSendTransactionMutation } from "../../store";
// COMPONENTS
import WalletHeader from "../components/WalletHeader";
import Button from "../../components/Button";
// ASSETS/ICONS/STATUS COMPONENTS
import wavePattern2 from "../../assets/images/wavePattern2.jpeg";
import { FaFileSignature } from "react-icons/fa";
import { GiWaves } from "react-icons/gi";

const SendTransactionPage = () => {
  const [ isLoggedIn, setIsLoggedIn ] = useState(secureLocalStorage.getItem("loggedIn"));
  const [ renderTxnResponse, setRenderTxnResponse ] = useState("");
  const [ renderTxnDetails, setRenderTxnDetails ] = useState("");
  const [ formInputs, setFormInputs ] = useState({});
  const [ txnDetails, setTxnDetails ] = useState("");
  const { sha256, signData, getAddressFromPublicKey } = useHashUtils();
  const [ sendTransaction ] = useSendTransactionMutation();

  window.addEventListener('secureLocalStorage', () => {
    setIsLoggedIn(secureLocalStorage.getItem("loggedIn"));
  });

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormInputs(values => ({...values, [name]: value}));
  }
  
  const handleSignTxn = (event) => {
    event.preventDefault();

    const transactionData = {
      from: getAddressFromPublicKey(formInputs.sender),
      to: formInputs.recipient,
      value: +formInputs.amount,
      fee: 10,
      dateCreated: new Date().toISOString(),
      data: "VinyasaChain Transaction",
      senderPubKey: formInputs.sender,
    }

    if (!transactionData.data) delete transactionData.data;
    let transactionDataJSON = JSON.stringify(transactionData).split(" ").join("");
    const dataHash = sha256(transactionDataJSON).toString();
    
    transactionData.transactionDataHash = dataHash;
    transactionData.senderSignature = signData(dataHash, secureLocalStorage.getItem("privKey"));
    transactionDataJSON = JSON.stringify(transactionData).split(" ").join("");

    setTxnDetails(transactionData);
    
    const { from, to , value, fee, dateCreated, data, senderPubKey, transactionDataHash, senderSignature } = transactionData;
    
    setRenderTxnDetails(`{
      "from": "${from}",
      "to": "${to}",
      "value": ${value},
      "fee": ${fee},
      "dateCreated": "${dateCreated}",
      "data": "${data}",
      "senderPubKey": "${senderPubKey}",
      "transactionDataHash": "${transactionDataHash}",
      "senderSignature": "${"[" + senderSignature[0] + ", "  + senderSignature[1] + "]"}
    }`);
  }
  console.log("RENDER TXN DETAILS SEND TXN ", renderTxnDetails);
  console.log("TXN DETAILS SEND TXN ", txnDetails);

  
  const handleSendTxn = (event) => {
    event.preventDefault();
    
    sendTransaction(txnDetails)
    .then(results => {
      const { transactionID } = results.data;

      console.log("DOT THEN TXN ID ", transactionID);
      console.log("RESULTS DATA ", results.data);

      setRenderTxnResponse("Transaction succesfully sent.\nTransaction Hash:\n" + transactionID);

    });

  }

  return (
    <div
      className="bg-cover bg-fixed w-full h-full overflow-auto"
      style={{ backgroundImage: `url(${wavePattern2})`}}
    >
      <WalletHeader login={isLoggedIn} />
      <div className="flex bg-gradient-to-b from-gray-900 via-transparent justify-center items-start w-full h-full text-white">
          <div className="flex justify-center overflow-y-auto w-2/3 h-max mx-auto my-6 px-5 pb-10 space-y-4 rounded-lg">
            <div className="overflow-x-auto w-full h-max px-5 py-3 rounded-lg border border-gray-700 bg-gray-900/60 shadow-md lg:w-3/5">
              <div className="flex items-center">
                <h1 className="w-full h-6 text-2xl font-normal">
                Send Transaction
                </h1>
              </div>
              <form onSubmit={handleSignTxn} className="mt-5">
                <div className="space-y-3 rounded-md shadow-sm">
                  <div>
                  <label htmlFor="sender" className="font-normal">
                      Sender
                    </label>
                    <input
                      type="search"
                      id="sender"
                      name="sender"
                      onChange={handleChange}
                      required
                      className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="Enter Public Key..."
                    />
                  </div>
                  <div>
                  <label htmlFor="recipient" className="font-normal">
                      Recipient
                    </label>
                    <input
                      type="search"
                      id="recipient"
                      name="recipient"
                      onChange={handleChange}
                      required
                      className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="Enter Recipient Address..."
                    />
                  </div>
                  <div>
                  <label htmlFor="amount" className="font-normal">
                      Value
                    </label>
                    <input
                      type="search"
                      id="amount"
                      name="amount"
                      onChange={handleChange}
                      required
                      className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="Enter Amount..."
                    />
                  </div>
                  <div>
                    <Button
                      submit
                      type="submit"
                    >
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <FaFileSignature className="ml-5 h-5 w-5 text-indigo-800" aria-hidden="true" />
                      </span>
                      Sign Transaction
                    </Button>
                  </div>
                  <div>
                    <textarea
                      // type="text"
                      id="txnInfo"
                      name="txnInfo"
                      value={renderTxnDetails && renderTxnDetails}
                      onChange={e => setRenderTxnDetails(e.target.value)}
                      className="relative block w-full h-28 appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-xs "
                      placeholder={"Transaction Details Response..."}
                    />
                  </div>
                </div>

              </form>
              <form className="mt-5 space-y-6">
                <div className="space-y-5 rounded-md shadow-sm">
                  <div>
                  <label htmlFor="nodeUrl" className="font-normal">
                      Blockchain Node
                    </label>
                    <input
                      type="search"
                      id="nodeUrl"
                      name="nodeUrl"
                      onChange={handleChange}
                      defaultValue="http://localhost:5555"
                      required
                      className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="Enter blockchain node..."
                    />
                  </div>
                  <div>
                    <Button
                      submit
                      type="button"
                      onClick={handleSendTxn}
                    >
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <GiWaves className="ml-5 h-7 w-7 text-indigo-800" aria-hidden="true" />
                      </span>
                      Send Transaction
                    </Button>
                  </div>
                  <div>
                    <textarea
                      type="text"
                      id="txnResponse"
                      name="txnResponse"
                      value={renderTxnResponse && renderTxnResponse}
                      onChange={e => setRenderTxnResponse(e.target.value)}
                      className="relative block w-full h-24 appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-sm "
                      placeholder={"Transaction Response..."}
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

export default SendTransactionPage;

// today =============================================================================================

// Extracted public key: bd6e69e5384f34acaa4f7d75e31508cf102ff68324e275a348b8d53aabb51b3e1

// Extracted blockchain address: 3f6e00c4cc8a71ed9c5d1ba523db38c65c66e377

// Generated random private key: d4a1a650e9dceff208ab74724cbd16fb32e2046201e9fa72f304ddfe4e34a964

// Extracted blockchain address: 301c3b2794c161acf7fe93d4c3b0f6d1964f1a20

// Extracted public key: e0763443ddf9e2f6974a81da9983d47b98b50343797639098973c14abe09caa80

// Generated random private key: f5485ea0071e142c175f3e8715aca782daef7d1d965b8f4384de595d8233b7e1



// Address: 1 ====================================================================================
// Generated random private key: d404f060542c67fc12f9c956d3b790ea04a667147d9976e214f60ce77b8136c4

// Extracted public key: 2bd656c2ad4db4b3a3b5323d71289edbc7b99ce71e41b0891e2bcd0716bf67b01

// Extracted blockchain address: f8752137e25ae836583c6d550b8469b12d9b7d8a
// Address: 2 ====================================================================================
// Generated random private key: e00f75d604005fce8bef9dad2c512a7416d56c45fce20af3428324f736dca31e

// Extracted public key: 2a90fa1391dac8d658fc771d159edec483cb3bc0c5349e6618ce92a57d03d29d0

// Extracted blockchain address: 0f386aa00e5e0097ec585dcf67044fe50f091bb6
// Address: 3 ====================================================================================
// Generated random private key: 1f1bb56388ecd31276208c4b40bd670862c39f5703071097710f57505cfe53ed

// Extracted public key: 80938773b53aea52962432bc85fb33ee428f5470f75699ac1f3e3d73834200490

// Extracted blockchain address: c56e1fab9fdc9aa6ab5efc1df5566c0afc998214

// Address: 4 ====================================================================================

// PRIVATE KEY: 4c220a013d77ef5979590e6071beb8069466b96a938c40d09ad05f4010824fb6

// PUBLIC KEY: f72705fa14ac211e77b8af89503a29485cd99567a74e56dcd4a137db575ce3421

// BLOCKCHAIN ADDRESS: fb1e47895ff3bd8f07abed798d40ac06e1848fcf