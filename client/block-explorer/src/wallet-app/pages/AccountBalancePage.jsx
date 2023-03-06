// LIBRARIES
import secureLocalStorage from "react-secure-storage";
// HOOKS
import { useState } from "react";
import { useFetchBalancesByAddressQuery } from "../../store";
// COMPONENTS
import Button from "../../components/Button";
import WalletHeader from "../components/WalletHeader";
// ASSETS/ICONS/STATUS COMPONENTS
import wavePattern2 from "../../assets/images/wavePattern2.jpeg";
import { GiBanknote } from "react-icons/gi";

const AccountBalancePage = () => {
  const [formInputs, setFormInputs] = useState({});
  const [generatedData, setGeneratedData] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(secureLocalStorage.getItem("loggedIn"));
  const {
    data,
    error,
    isFetching
  } = useFetchBalancesByAddressQuery((formInputs && formInputs.address));

  window.addEventListener('secureLocalStorage', () => {
    setIsLoggedIn(secureLocalStorage.getItem("loggedIn"));
  });
  
  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormInputs(values => ({...values, [name]: value}));
  }
  
  const handleSubmit = (event) => {
    event.preventDefault();
    const balances = data.addressBalances;
    
    const { safeBalance, confirmedBalance, pendingBalance, } = balances;

    if (isFetching) {
      setGeneratedData("Fetching Data...");
    } else if (error) {
      setGeneratedData("Error - Unable to fetch data");
    } else {
      setGeneratedData(
        "Balance (confirmed): " +
        safeBalance + " PRANA" +
        "\n" +
        "\n" +
        "Balance (1 confirmation): " +
        confirmedBalance + " PRANA" +
        "\n" +
        "\n" +
        "Balance (pending): " +
        pendingBalance + " PRANA"
      );
    }
  }

  return (
    <div
      className="bg-cover bg-fixed w-full h-full overflow-auto"
      style={{ backgroundImage: `url(${wavePattern2})`}}
    >
      <WalletHeader login={isLoggedIn} />
      <div className="flex bg-gradient-to-b from-gray-900 via-transparent justify-center items-start w-full h-full text-white">
          <div className="flex justify-center w-2/3 h-max mx-auto my-10 px-5 space-y-4 rounded-lg">
            <div className="overflow-x-auto w-full h-max px-5 py-5 rounded-lg border border-gray-700 bg-gray-900/60 shadow-md lg:w-3/5">
              <div className="flex items-center">
                <h1 className="w-full h-10 text-2xl font-normal">
                View Account Balance
                </h1>
              </div>
              <form onSubmit={handleSubmit} className="mt-5 space-y-6">
                <div className="space-y-5 rounded-md shadow-sm">
                  <div>
                  <label htmlFor="address" className="font-normal">
                      Address
                    </label>
                    <input
                      type="search"
                      id="address"
                      name="address"
                      onChange={handleChange}
                      autoComplete="off"
                      required
                      className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="Enter wallet address..."
                    />
                  </div>
                  <div>
                  <label htmlFor="nodeUrl" className="font-normal">
                      Blockchain Node
                    </label>
                    <input
                      type="text"
                      id="nodeUrl"
                      name="nodeUrl"
                      onChange={handleChange}
                      autoComplete="off"
                      defaultValue="http://localhost:5555"
                      required
                      className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                      placeholder="Enter blockchain node..."
                    />
                  </div>
                  <div>
                  <Button
                    submit
                    type="submit"
                  >
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                      <GiBanknote className="ml-5 h-8 w-8 text-indigo-800" aria-hidden="true" />
                    </span>
                    Display Balance
                  </Button>
                </div>
                  <div>
                    <textarea
                      type="text"
                      id="balances"
                      name="balances"
                      value={generatedData && generatedData}
                      onChange={e => setGeneratedData(e.target.value)}
                      className="relative block w-full h-56 appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 text-sm "
                      placeholder={"Current Balances..."}
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