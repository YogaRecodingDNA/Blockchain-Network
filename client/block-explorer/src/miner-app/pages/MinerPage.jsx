// LIBRARIES
import secureLocalStorage from 'react-secure-storage';
// HOOKS
import { useState } from 'react';
import { useFetchAllPeersQuery, useConnectToPeerMutation } from '../../store';
// COMPONENTS
import SearchBar from "../../components/navigation/SearchBar";
import DataPanelLarge from "../../components/panels/DataPanelLarge";
import Button from "../../components/Button";
import Miner from "../components/Miner";
import { Link } from "react-router-dom"
// ASSETS
import miningForEnergy from "../../assets/images/miningForEnergy.jpeg";
import { GiCrossedChains } from 'react-icons/gi';

const MinerPage = () => {
  const [isPeer1, setIsPeer1] = useState(secureLocalStorage.getItem("peer1"));
  const [isPeer2, setIsPeer2] = useState(secureLocalStorage.getItem("peer2"));
  const [isPeer3, setIsPeer3] = useState(secureLocalStorage.getItem("peer3"));
  const [isPeer4, setIsPeer4] = useState(secureLocalStorage.getItem("peer4"));
  const [ connectToPeer ] = useConnectToPeerMutation();
  const {
    data: peersData,
    error: peersError,
    isFetching: peersIsFetching
  } = useFetchAllPeersQuery();

  const peers = {
    peersData,
    peersError,
    peersIsFetching
  }
  
  window.addEventListener('secureLocalStorage', () => {
    setIsPeer1(secureLocalStorage.getItem("peer1"));
    setIsPeer2(secureLocalStorage.getItem("peer2"));
    setIsPeer3(secureLocalStorage.getItem("peer3"));
    setIsPeer4(secureLocalStorage.getItem("peer4"));
  });

  const handleConnectPeers = (url, peer) => {
    console.log("HANDLE CONN PEERS", peer);
    if (!secureLocalStorage.getItem(`peer${peer}`)) {
      secureLocalStorage.setItem(`peer${peer}`, true);
      connectToPeer(url);
      window.dispatchEvent(new Event("secureLocalStorage"));
    }
  }

  const peerUrls = [
    { url: "http://localhost:5556", connection: isPeer1 },
    { url: "http://localhost:5557", connection: isPeer2 },
    { url: "http://localhost:5558", connection: isPeer3 },
    { url: "http://localhost:5559", connection: isPeer4 },
  ]

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
              <Link to="/wallet" className="text-xl font-medium text-violet-400">LOGIN</Link> from the wallet section to create a new wallet, or <Link to="/wallet/open-existing" className="text-xl font-medium text-violet-400">OPEN</Link> an existing wallet to auto-login, and receive crypto rewards to that address from mining blocks.
              </p>
            </div>
          </h1>
        </div>
        <DataPanelLarge>
          <div className='flex w-full items-center px-6 py-7 h-10 bg-cyan-900'>
            <h2 className="text-lg font-medium">CONNECT TO A PEER</h2>
            <p className="ml-3 text-sm font-medium text-gray-400"> (OPTIONALLY CONNECT THIS NODE TO A LOCAL PEER)</p>
          </div>
          <table className="table-auto w-full text-center text-sm text-white">
            <thead className='px-6 py-5 h-14 font-normal bg-gradient-to-b from-cyan-900 via-cyan-900'>
              <tr>
                <th className="px-12 py-5" scope="col">PEER 1</th>
                <th className="px-12 py-5" scope="col">PEER 2</th>
                <th className="px-12 py-5" scope="col">PEER 3</th>
                <th className="px-12 py-5" scope="col">PEER 4</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              <tr>
                {peerUrls.map((peer, index) => {
                  console.log(`PEER CONNECTION ${index + 1} ==` , peer.connection)
                  return (
                    <td id={index} className="px-12 py-4 border-x border-cyan-700">
                      { peer.connection ? 
                          <Button error onClick={secureLocalStorage.removeItem(`peer${index + 1}`)} >
                          Disonnect
                        <GiCrossedChains className="ml-1 text-lg text-white" /></Button> :
                        <Button primary onClick={() => handleConnectPeers(peer.url, (index + 1))} >
                          Connect
                        <GiCrossedChains className="ml-1 text-lg text-white" /></Button>
                      }
                    </td>
                  )
                })}
              </tr>
            </tbody>
          </table>
          <div className='flex justify-center px-6 py-5 h-16 font-semibold bg-gradient-to-t from-cyan-900 via-cyan-900'>
          </div>
        </DataPanelLarge>
        <DataPanelLarge>
          <Miner peers={peers}  />
        </DataPanelLarge>
      </div>
    </div>
  )
}

export default MinerPage;