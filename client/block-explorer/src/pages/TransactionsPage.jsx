// HOOKS
import { useFetchConfirmedTransactionsQuery, useFetchPendingTransactionsQuery } from "../store";
// COMPONENTS
import SearchBar from "../components/navigation/SearchBar";
import PageHead from "../components/PageHead";
import HeadPanelHalf from "../components/panels/HeadPanelHalf";
import DataPanelLarge from "../components/panels/DataPanelLarge";
import ConfirmedTxns from "../components/transactions/ConfirmedTxns";
// ASSETS/ICONS/STATUS COMPONENTS
import moonExplorer from "../assets/images/moonExplorer.jpeg";

const TransactionsPage = () => {
  const { data: confirmedData } = useFetchConfirmedTransactionsQuery();
  const { data: pendingData } = useFetchPendingTransactionsQuery();

  return (
    <div className="flex bg-cover bg-fixed w-full h-full" style={{ backgroundImage: `url(${moonExplorer})`}} >
      <div className="w-full h-screen overflow-auto bg-gradient-to-b from-gray-900 via-transparent text-white">
        <div>
          <div className="flex items-start w-10/12 ml-auto">
            <SearchBar />
          </div>
        </div>
        <PageHead>TRANSACTIONS</PageHead>
        <div className="flex my-5 mx-5 h-20 space-x-4">
          <HeadPanelHalf title="CONFIRMED TRANSACTIONS" data={confirmedData && confirmedData.length}/>
          <HeadPanelHalf title="PENDING TRANSACTIONS" data={pendingData && pendingData.length}/>
        </div>
        <DataPanelLarge>
          <ConfirmedTxns />
        </DataPanelLarge>
      </div>
    </div>
  )
}

export default TransactionsPage;