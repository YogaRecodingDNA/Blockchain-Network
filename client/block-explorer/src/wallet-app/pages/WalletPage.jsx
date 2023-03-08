// LIBRARIES
import secureLocalStorage from "react-secure-storage";
// HOOKS
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// COMPONENTS
import Button from "../../components/Button";
import WalletHeader from "../components/WalletHeader";
// ASSETS/ICONS/STATUS COMPONENTS
import vaultLockers from "../../assets/images/vaultLockers.jpeg";

const WalletPage = () => {
  const [ isLoggedIn, setIsLoggedIn ] = useState(secureLocalStorage.getItem("loggedIn"));
  const navigate = useNavigate();

  window.addEventListener('secureLocalStorage', () => {
    setIsLoggedIn(secureLocalStorage.getItem("loggedIn"));
  });

  const handleLogin = () => {
    if (!isLoggedIn) {
      secureLocalStorage.setItem("loggedIn", true);
      setIsLoggedIn(true);
      navigate("/wallet/create");
    } else if (isLoggedIn) {
      setIsLoggedIn(false);
      // secureLocalStorage.setItem("loggedIn", false);
      secureLocalStorage.clear();
    }
    
    if (isLoggedIn === false) {
    }

    window.dispatchEvent(new Event("secureLocalStorage"));
  }

  return (
    <div className="bg-cover bg-fixed w-full h-full" style={{ backgroundImage: `url(${vaultLockers})`}}>
      <WalletHeader />
      <div className="flex bg-gradient-to-b from-gray-900 justify-center items-start w-full h-full text-white border-t border-sky-400">
        <div className="w-3/4 font-medium mt-28">
          <h1 className="font-medium text-center text-4xl">
            Manage your crypto energies with a wallet.
            <div className="pt-4 px-7 text-gray-100 font-normal">
              <p className="text-2xl">This wallet is a free, simple service enabling you to generate addresses for sending, recieving, and storing your <span className="text-lg italic font-medium">PRANA</span> Crypto Tokens within the VinyasaChain network.
              <br />
              Login below to create a new wallet, or <Link to="/wallet/open-existing" className="text-2xl text-violet-400 font-medium underline-offset-4 hover:text-sky-400 hover:underline"> open</Link> an existing wallet for auto-login.
              </p>
            </div>
          </h1>
          <div className="mt-10">
            { isLoggedIn ?
              <Button className="mx-auto" logout onClick={handleLogin}>
                Logout
              </Button> :
              <Button className="mx-auto" login onClick={handleLogin}>
                Login
              </Button>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default WalletPage;

