import { useFetchBlocksQuery, useFetchConfirmedTransactionsQuery } from "../store";
import moonExplorer from "../assets/images/moonExplorer.jpeg";
import SearchBar from "../components/navigation/SearchBar";
import PageHead from "../components/PageHead";
import HeadPanelHalf from "../components/panels/HeadPanelHalf";
import DataPanelLarge from "../components/panels/DataPanelLarge";
import Blocks from "../components/blocks/Blocks";

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

  const handleSubmit = () => {
    console.log("Search Click");
  }

  return (
    <div className="flex bg-cover bg-fixed w-full h-full" style={{ backgroundImage: `url(${moonExplorer})`}} >
      <div className="w-full h-screen overflow-auto bg-gradient-to-b from-gray-900 via-transparent text-white">
        <div>
          <div className="flex items-start w-10/12 ml-auto">
            <SearchBar onSubmit={handleSubmit} />
          </div>
        </div>
        <PageHead>VINYASA BLOCKCHAIN</PageHead>
        <div className="flex my-5 mx-5 h-20 space-x-4">
          <HeadPanelHalf title="BLOCKS" data={blocksData && blocksData.length}/>
          <HeadPanelHalf title="TRANSACTIONS" data={confirmedData && confirmedData.length}/>
        </div>
        <DataPanelLarge>
          <Blocks />
        </DataPanelLarge>
        {/* <div className="w-full h-max mx-auto my-10 px-5 space-y-4 rounded-lg">
          <div className="overflow-x-auto w-full h-max rounded-lg border border-gray-700 bg-gray-900/40 shadow-md">
            <Blocks />
          </div>
        </div> */}
      </div>
    </div>
  )
}

export default BlockchainPage;