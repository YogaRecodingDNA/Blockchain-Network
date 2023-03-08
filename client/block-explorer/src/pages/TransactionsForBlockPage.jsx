// HOOKS
import { useLocation, useNavigate } from "react-router-dom";
import { useFetchConfirmedTransactionsQuery } from "../store";
// COMPONENTS
import SearchBar from "../components/navigation/SearchBar";
import PageHead from "../components/PageHead";
import HeadPanelHalf from "../components/panels/HeadPanelHalf";
import DataPanelLarge from "../components/panels/DataPanelLarge";
import BlockTxns from "../components/blocks/BlockTxns";
// ASSETS/ICONS/STATUS COMPONENTS
import moonExplorer from "../assets/images/moonExplorer.jpeg";

const TransactionsForBlockPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { linkData } = location.state;
  const { data: confirmedData } = useFetchConfirmedTransactionsQuery();

  const transactions = linkData;
  const blockReward = transactions[0].value;
  const totalFees = transactions.map((txn) => txn.fee).reduce((a, b) => a + b) / 1000000;
  const totalReward = blockReward + totalFees;

  const blockNumber = (
    (transactions[0].minedInBlockIndex === 0) ?
    "GENESIS BLOCK" :
    transactions[0].minedInBlockIndex
  );

  console.log("Reward === ", transactions[0].value);
  console.log("Fees", totalFees);

  return (
    <div className="flex bg-cover bg-fixed w-full h-full" style={{ backgroundImage: `url(${moonExplorer})`}} >
      <div className="w-full h-screen overflow-auto bg-gradient-to-b from-gray-900 via-transparent text-white">
        <div>
          <div className="flex items-start w-10/12 ml-auto">
            <SearchBar />
          </div>
        </div>
        <PageHead>
          TRANSACTIONS FOR BLOCK # <button onClick={() => navigate(-1)} className="text-xl font-normal text-violet-400">{blockNumber}</button>
        </PageHead>
        <div className="flex my-5 mx-5 h-20 space-x-4">
          <HeadPanelHalf title="TRANSACTIONS" data={transactions.length}/>
          <HeadPanelHalf title="TOTAL PRANA REWARD" data={totalReward}/>
        </div>
        <DataPanelLarge>
          <BlockTxns txns={transactions} />
        </DataPanelLarge>
      </div>
    </div>
  )
}

export default TransactionsForBlockPage;