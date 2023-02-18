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
import { Link } from "react-router-dom";
// ASSETS
import moonExplorer from "../assets/images/moonExplorer.jpeg";
import { TbChevronsRight } from "react-icons/tb";

const BlockchainPage = () => {
  const {
    data: confirmedData,
    // error: confirmedError,
    // isFetching: confirmedIsFetching
  } = useFetchConfirmedTransactionsQuery();
  const {
    data: blocksData,
    // error: blockserror,
    // isFetching: blocksIsFetching
  } = useFetchBlocksQuery();
  const {
    data: peerData,
    // error: peerError,
    // isFetching: peerIsFetching
  } = useFetchPeerInfoQuery();

  const peersLink = (
    <div className="w-full hover:text-violet-400">
      <Link to="/peers" state={{ linkData: peerData }} className="flex hover:text-violet-400">
        PEERS
        <TbChevronsRight className="ml-1 text-xl" />
      </Link>
    </div>
  )

  console.log("Blocks.jsx PEER DATA", peerData);

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
          <HeadPanelHalf title="TRANSACTIONS" data={confirmedData && confirmedData.length}/>
        </div>
        <div className="flex my-5 mx-5 h-20 space-x-4">
          <HeadPanelHalf title={peersLink} data={peerData && peerData.peersTotal} />
          <HeadPanelHalf title="CURRENT DIFFICULTY" data={peerData && peerData.currentDifficulty}/>
        </div>
        <DataPanelLarge>
          <Blocks />
        </DataPanelLarge>
      </div>
    </div>
  )
}

export default BlockchainPage;