import { useState } from "react";
import moonExplorer from "../assets/images/moonExplorer.jpeg";
import Panel from "../components/Panel";
import SearchBar from "../components/SearchBar";
import LatestBlocksDataTable from "../components/LatestBlocksDataTable";
import LatestTxnsConfirmedExplorer from "../components/LatestTxnsConfirmedExplorer";
import LatestTxnsPendingExplorer from "../components/LatestTxnsPendingExplorer";
import LatestTxnsHeadingExplorer from "../components/LatestTxnsHeadingExplorer";
// import Button from "../components/Button";
// import { FcDownload } from 'react-icons/fc'


const ExplorerPage = () => {
  const [isConfirmedTxns, setIsConfirmedTxns] = useState(true);

  const handleToggleTxns= () => {
    setIsConfirmedTxns(!isConfirmedTxns);
  }

  const handleSubmit = () => {
    console.log("Search Click");
  }
  
  return (
    <div className="flex overflow-auto bg-cover bg-fixed w-full h-full" style={{ backgroundImage: `url(${moonExplorer})`}} >
      <div className="w-full h-full bg-gradient-to-b from-gray-900 via-transparent text-white">
        <div className="pt-10">
          <div className="ml-auto w-10/12">
            <h1 className="text-xl font-normal">The Vinyasachain Block Explorer</h1>
          </div>
          <div className="flex items-start w-10/12 mt-4 ml-auto">
            <SearchBar onSubmit={handleSubmit} />
          </div>
        </div>
        <Panel containerExplorer className="hidden h-96 space-x-4 md:flex">
          <Panel fullExplorer className="overflow-y-auto">
            <LatestBlocksDataTable />
          </Panel>
          <Panel fullExplorer className="overflow-auto">
            <LatestTxnsHeadingExplorer
            onToggleTxns={handleToggleTxns}
            isConfirmedTxns={isConfirmedTxns}
          />
            {isConfirmedTxns ? <LatestTxnsConfirmedExplorer /> : <LatestTxnsPendingExplorer />}
          </Panel>
        </Panel>
        <Panel containerExplorer className="h-full space-y-4 md:hidden">
          <Panel mobileExplorer className="overflow-y-auto">
            <LatestBlocksDataTable />
          </Panel>
          <Panel mobileExplorer className="overflow-auto">
            <LatestTxnsHeadingExplorer
              onToggleTxns={handleToggleTxns}
              isConfirmedTxns={isConfirmedTxns}
            />
            {isConfirmedTxns ? <LatestTxnsConfirmedExplorer /> : <LatestTxnsPendingExplorer />}
          </Panel>
        </Panel>
      </div>
    </div>
  )
}

export default ExplorerPage;

/* Block Explorer functionality
-View blocks
-View confirmed transactions
-View pending transactions
-View accounts and balances
-View peers
-View network difficulty
*/




// const [info, setInfo] = useState({});

// const handleSubmit = async () => {
//   await axios.get("http://localhost:5555/blocks")
//   .then( data => {
//     data = data.data;
//     const newInfo = {
//       ...info,
//       data
//     }
//     setInfo(newInfo);
//     console.log(info);
//   }).catch( err => console.error(err));
// }