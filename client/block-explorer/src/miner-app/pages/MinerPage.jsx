// COMPONENTS
import SearchBar from "../../components/navigation/SearchBar";
import DataPanelLarge from "../../components/panels/DataPanelLarge";
import Miner from "../components/Miner";
import { Link } from "react-router-dom"
// ASSETS
import miningForEnergy from "../../assets/images/miningForEnergy.jpeg";

const MinerPage = () => {

  return (
    <div className="flex bg-cover bg-fixed w-full h-full" style={{ backgroundImage: `url(${miningForEnergy})`}} >
      <div className="w-full h-screen overflow-auto bg-gradient-to-b from-gray-900 via-gray-900/20 text-white">
        <div>
          <div className="flex items-start w-10/12 ml-auto">
            <SearchBar />
          </div>
        </div>
        <div className="w-3/4 mx-auto font-medium mt-16">
          <h1 className="font-light text-center text-5xl">
            Vinyasa Block Miner
            <div className="pt-4 px-7 text-gray-100 font-normal">
              <p className="text-2xl">The Vinyasa Block Miner is a blockchain application which allows you to mine blocks and receive <span className="text-lg text-sky-400 font-medium">PRANA</span> coin <span className="text-lg text-gray-400 font-medium">(Crypto Energy)</span>.
              <br />
              <Link to="/wallet" className="text-violet-400 underline">Login</Link> from the wallet section to create a new wallet, or <Link to="/wallet/open-existing" className="text-violet-400 underline">open an existing wallet</Link> to auto-login, and receive crypto rewards to that address from mining blocks.
              </p>
            </div>
          </h1>
        </div>
        <DataPanelLarge>
          <Miner />
        </DataPanelLarge>
      </div>
    </div>
  )
}

export default MinerPage;