// HOOKS
import { useState } from "react";
import { useFetchBlocksQuery, useFetchAllTransactionsQuery } from "../store";
// COMPONENTS
import ExplorerPanel from "../components/panels/ExplorerPanel";
import SearchBar from "../components/navigation/SearchBar";
import HeadPanelHalf from "../components/panels/HeadPanelHalf";
import HeadLink from "../components/navigation/HeadLink";
import LatestBlocksDataTable from "../components/blocks/LatestBlocksDataTable";
import LatestTxnsConfirmedExplorer from "../components/transactions/LatestTxnsConfirmedExplorer";
import LatestTxnsPendingExplorer from "../components/transactions/LatestTxnsPendingExplorer";
import LatestTxnsHeadingExplorer from "../components/transactions/LatestTxnsHeadingExplorer";
// ASSETS/ICONS/STATUS COMPONENTS
import moonExplorer from "../assets/images/moonExplorer.jpeg";


const ExplorerPage = () => {
  const { data: blxData } = useFetchBlocksQuery();
  const { data: txnsData } = useFetchAllTransactionsQuery();
  const [ isConfirmedTxns, setIsConfirmedTxns ] = useState(true);
  const totalBlocks = blxData && blxData.length;
  const totalTxns = txnsData && txnsData.length;

  const handleToggleTxns= () => {
    setIsConfirmedTxns(!isConfirmedTxns);
  }
  
  return (
    <div className="flex overflow-auto bg-cover bg-fixed w-full h-full" style={{ backgroundImage: `url(${moonExplorer})`}} >
      <div className="w-full h-full bg-gradient-to-b from-gray-900 via-transparent text-white">
        <div className="pt-10">
          <div className="ml-auto w-10/12">
            <h1 className="text-xl font-normal">The Vinyasachain Block Explorer</h1>
          </div>
          <div className="flex items-start w-10/12 mt-4 ml-auto">
            <SearchBar />
          </div>
        </div>
        <div className="flex mt-5 mx-5 h-20 space-x-4">
          <HeadPanelHalf
            title={<HeadLink path="/blockchain" titleHead="TOTAL BLOCKS" dataHead={blxData} />}
            data={totalBlocks}
          />
          <HeadPanelHalf
            title={<HeadLink path="/transactions" titleHead="TOTAL TRANSACTIONS" dataHead={txnsData} />}
            data={totalTxns}
          />
        </div>
        <ExplorerPanel containerExplorer className="hidden h-96 space-x-4 md:flex">
          <ExplorerPanel fullExplorer className="overflow-y-auto">
            <LatestBlocksDataTable />
          </ExplorerPanel>
          <ExplorerPanel fullExplorer className="overflow-auto">
            <LatestTxnsHeadingExplorer
            onToggleTxns={handleToggleTxns}
            isConfirmedTxns={isConfirmedTxns}
          />
            {isConfirmedTxns ? <LatestTxnsConfirmedExplorer /> : <LatestTxnsPendingExplorer />}
          </ExplorerPanel>
        </ExplorerPanel>
        <ExplorerPanel containerExplorer className="h-full space-y-4 md:hidden">
          <ExplorerPanel mobileExplorer className="overflow-y-auto">
            <LatestBlocksDataTable />
          </ExplorerPanel>
          <ExplorerPanel mobileExplorer className="overflow-auto">
            <LatestTxnsHeadingExplorer
              onToggleTxns={handleToggleTxns}
              isConfirmedTxns={isConfirmedTxns}
            />
            {isConfirmedTxns ? <LatestTxnsConfirmedExplorer /> : <LatestTxnsPendingExplorer />}
          </ExplorerPanel>
        </ExplorerPanel>
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
