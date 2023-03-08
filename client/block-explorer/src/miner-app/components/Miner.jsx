// LIBRARIES
import secureLocalStorage from 'react-secure-storage';
// HOOKS
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useFetchMineNewBlockQuery, useFetchPendingTransactionsQuery } from '../../store';
// COMPONENTS
import Button from '../../components/Button';
import HashLink from '../../components/navigation/HashLink';
import StatusCurrentNode from '../../components/status-indicators/StatusCurrentNode';
// ASSETS
import { GiMining } from 'react-icons/gi';
import { Dna } from 'react-loader-spinner';

const currentUrl = "http://localhost:5555";

const Miner = ({ peers }) => {
  const navigate = useNavigate();
  const [ isLoggedIn ] = useState(secureLocalStorage.getItem("loggedIn"));
  const [ isWalletActive ] = useState(secureLocalStorage.getItem("address"));
  const [ isMessage, setIsMessage ] = useState(false);
  const [ isNoTxns, setIsNoTxns ] = useState(false);
  const [ isMining, setIsMining ] = useState(false);
  const [ minerNodeUrl, setMinerNodeUrl ] = useState("");
  const [ minerAddress, setMinerAddress ] = useState("");
  const { data: txnsData } = useFetchPendingTransactionsQuery();
  const { data: miningData } = useFetchMineNewBlockQuery(
      { nodeUrl: minerNodeUrl, address: minerAddress },
      { skip: isMining }
  );

  const handleMineClick = (nodeUrl) => { // HANDLE MINER CLILCK
    if (!isLoggedIn || !isWalletActive) {
      setIsMessage(true);
      return;
    }

    if (txnsData.length === 0) {
      setIsNoTxns(true);
    } else {
      setMinerAddress(secureLocalStorage.getItem("address"));
      setMinerNodeUrl(nodeUrl);
  
      if ( minerNodeUrl && minerAddress ){
        setIsMining(true);
      }
    }
  }

  const handleClickBlockchainPage = () => { // HANDLE CLICK LOGIN PAGE BUTTON
    navigate("/blockchain");
    setIsMessage(false);
  }

  const handleClickWalletPage = () => { // HANDLE CLICK LOGIN PAGE BUTTON
    // Route to login
    navigate("/wallet");
    setIsMessage(false);
  }
  
  let peerInfo;
  if (peers.peersIsFetching) {
    peerInfo = (
      <tr>
        <td>
          <Dna
            visible={true}
            height="80"
            width="80"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
          />
        </td>
      </tr>
    );
  } else if (peers.peersError) {
    peerInfo = <div>Error loading peer nodes.</div>
  } else {
    let count = 1;
    peerInfo = [];

    for (let node in peers.peersData) {
      const nodeId = node;
      const nodeUrl = peers.peersData[node];

      peerInfo.push(
        <tr key={nodeId} className="text-left text-white bg-transparent hover:bg-violet-400/50">
              <td className="flex space-x-10 px-16 py-4 text-xs font-semibold items-center">
                <HashLink to="/peers/details" linkData={nodeUrl}>
                  { count === 1 ? "Genesis" : "Peer " + (count - 1) }
                </HashLink>
                {(currentUrl === nodeUrl) && <StatusCurrentNode />}
              </td>
              <td className="px-12 py-4 truncate">
                <HashLink to="/peers/details" linkData={nodeUrl}>
                  {nodeId}
                </HashLink>
              </td>
              <td className="px-10 py-4 text-xs font-semibold truncate">
                  {nodeUrl}
              </td>
              <td className="px-2 py-4 text-xs font-semibold truncate">
                  <Button primary onClick={() => handleMineClick(nodeUrl)} >
                    Mine
                  <GiMining className="ml-1 text-lg text-white" /></Button>
              </td>
          </tr>
      );

      count++;
    };

  }

  console.log("MINING DATA ========= ", miningData);

  return (
    <div>
      <div className='flex w-full items-center px-6 py-7 h-10 bg-cyan-900'>
        <h2 className="ml-2 text-3xl">Mining</h2>
      </div>
        { miningData && 
          <Button
            success
            type="button"
            onClick={handleClickBlockchainPage}
            className="space-x-5"
          >
            Success! Awarded {miningData.expectedReward} PRANA!
            <span className="ml-10 px-3 rounded-full bg-gray-900/80 hover:bg-violet-600">
                view on chain
            </span>
          </Button>
        }
        { isNoTxns && 
          <Button
            error
            type="button"
            onClick={() => setIsNoTxns(false)}
          >
            Transaction pool empty (nothing to mine)
          </Button>
        }
        { (isMessage && !isWalletActive) &&
          <Button
            warning
            type="button"
            onClick={handleClickWalletPage}
          >
            Must be logged in with an activated wallet to Mine. Click for login page.
          </Button>
        }
      <table className="table-auto w-full text-left text-sm text-white">
        <thead className='px-6 py-5 h-14 font-normal bg-gradient-to-b from-cyan-900 via-cyan-900'>
          <tr>
            <th className="px-16 py-5" scope="col">PEER</th>
            <th className="px-12 py-5" scope="col">Node I.D.</th>
            <th className="px-10 py-5" scope="col">Node URL</th>
            <th className="px-2 py-5" scope="col">Mine New Block</th>
            { isMessage && <th className="px-5 py-5" scope="col"></th> }
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
            {peerInfo}
        </tbody>
      </table>
      <div className='flex justify-center px-6 py-5 h-16 font-semibold bg-gradient-to-t from-cyan-900 via-cyan-900'>
      </div>
    </div>
  )
}

export default Miner;