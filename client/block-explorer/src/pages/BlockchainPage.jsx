// HOOKS
import {
  useFetchBlocksQuery,
  useFetchConfirmedTransactionsQuery,
  useFetchPeerInfoQuery
} from "../store";
// COMPONENTS
import SearchBar from "../components/navigation/SearchBar";
import PageHead from "../components/PageHead";
import HeadPanelHalf from "../components/panels/HeadPanelHalf";
import DataPanelLarge from "../components/panels/DataPanelLarge";
import Blocks from "../components/blocks/Blocks";
import HeadLink from "../components/navigation/HeadLink";
// ASSETS/ICONS/STATUS COMPONENTS
import moonExplorer from "../assets/images/moonExplorer.jpeg";

const BlockchainPage = () => {
  const { data: confirmedTxnsData } = useFetchConfirmedTransactionsQuery();
  const { data: blocksData } = useFetchBlocksQuery();
  const { data: peerData } = useFetchPeerInfoQuery();

  return (
    <div className="flex bg-cover bg-fixed w-full h-full" style={{ backgroundImage: `url(${moonExplorer})`}} >
      <div className="w-full h-screen overflow-auto bg-gradient-to-b from-gray-900 via-transparent text-white">
        <div>
          <div className="flex items-start w-10/12 ml-auto">
            <SearchBar />
          </div>
        </div>
        <PageHead>VINYASA BLOCKCHAIN</PageHead>
        <div className="flex my-5 mx-5 h-20 space-x-4">
          <HeadPanelHalf title="BLOCKS" data={blocksData && blocksData.length}/>
          <HeadPanelHalf title="TRANSACTIONS" data={confirmedTxnsData && confirmedTxnsData.length}/>
        </div>
        <div className="flex my-5 mx-5 h-20 space-x-4">
          <HeadPanelHalf
            title={<HeadLink path="/peers" titleHead="TOTAL PEERS" dataHead={peerData} />}
            data={peerData && peerData.peersTotal}
          />
          <HeadPanelHalf
            title="CURRENT DIFFICULTY"
            data={peerData && peerData.currentDifficulty}
          />
        </div>
        <DataPanelLarge>
          <Blocks />
        </DataPanelLarge>
      </div>
    </div>
  )
}

export default BlockchainPage;