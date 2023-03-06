import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFaucetTxnSendMutation } from "../store";
// COMPONENTS
import Button from "../../components/Button";
// ASSETS/ICONS/STATUS COMPONENTS
import { GiCoinflip } from "react-icons/gi";

const faucetAddress = "f3d7dfd60b51f6804d47440e59404a393cdd9a78"

const Form = () => {
  const [ faucetTxnSend ] = useFaucetTxnSendMutation();
  const [ isFaucetDonation, setIsFaucetDonation ] = useState(false);
  const [formInputs, setFormInputs] = useState({});
  const navigate = useNavigate();

  const handleClick = () => {
    setIsFaucetDonation(!isFaucetDonation);
  }

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormInputs(values => ({...values, [name]: value}));
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const target = event.target;

    faucetTxnSend({recipientAddress: formInputs.recipient, amount: formInputs.amount});
    
    target.reset();
    
    navigate("/userAddress", { state: { linkData: formInputs.recipient } });
  }

  return (
    <div className="w-2/3 h-max mx-auto my-10 px-5 space-y-4 rounded-lg">
            <div className="overflow-x-auto w-full h-max px-5 py-5 rounded-lg border border-gray-700 bg-gray-900/60 shadow-md">
              <div className="flex items-center">
                <h1 className="w-full h-10 ml-4 text-2xl font-normal">
                  VinyasaChain Faucet
                </h1>
                <Button
                  secondary
                  onClick={handleClick}
                  className="h-8 rounded border-2 border-indigo-600"
                >
                  { isFaucetDonation ? "Remove" : "Donate" }
                </Button>
              </div>
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <div className="space-y-5 rounded-md shadow-sm">
                  <div>
                    { isFaucetDonation &&
                    <label htmlFor="recipient-address" className="font-normal">
                      Faucet Address
                    </label> }
                    <input
                      type="text"
                      id="recipient-address"
                      name="recipient"
                      value={ isFaucetDonation ? faucetAddress : (formInputs.recipient || "") }
                      onChange={handleChange}
                      required
                      className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="Recipient Address"
                    />
                  </div>
                  {/* <<<<<<<< IF DONATE BUTTON CLICKED >>>>>>>>>>>> */}
                  { isFaucetDonation && 
                  <div>
                    { isFaucetDonation &&
                    <label htmlFor="sender-pubKey" className="font-normal">
                      Sender Public Key
                    </label>
                    }
                    <input
                      type="text"
                      id="sender-pubKey"
                      name="sender"
                      value={formInputs.sender}
                      onChange={handleChange}
                      required
                      className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="Enter Public Key"
                    />
                  </div>
                  }
                  {/* <<<<<<<<<<<<<<<<<<<<<<<<>>>>>>>>>>>>>>>>>>>>>>> */}
                  <div>
                    <label htmlFor="amount" className="sr-only">
                      PRANA Amount
                    </label>
                    <input
                      type="text"
                      id="amount"
                      name="amount"
                      value={formInputs.amount}
                      onChange={handleChange}
                      required
                      className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder={ isFaucetDonation ? 
                        "PRANA Donation Amount" :
                        "PRANA Amount...value between 1-10" }
                    />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="group relative flex w-full justify-center rounded-md border border border-indigo-600 py-2 px-4 text-sm font-medium text-white bg-gradient-to-r from-cyan-700 to-teal-400 hover:from-sky-400 hover:to-violet-500 text-white drop-shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <GiCoinflip className="ml-5 h-5 w-5 text-indigo-800" aria-hidden="true" />
                    </span>
                    Get PRANA
                  </button>
                </div>
              </form>
              
            </div>
          </div>
  )
}

export default Form;