// COMPONENTS
import SearchBar from "../components/navigation/SearchBar";
import PageHead from "../components/PageHead";
import DataPanelLarge from "../components/panels/DataPanelLarge";
import Peers from "../components/Peers";
// ASSETS
import moonExplorer from "../assets/images/moonExplorer.jpeg";

const AllPeersPage = () => {

  return (
    <div className="flex bg-cover bg-fixed w-full h-full" style={{ backgroundImage: `url(${moonExplorer})`}} >
      <div className="w-full h-screen overflow-auto bg-gradient-to-b from-gray-900 via-transparent text-white">
        <div>
          <div className="flex items-start w-10/12 ml-auto">
            <SearchBar />
          </div>
        </div>
        <PageHead>CONNECTED PEERS</PageHead>
        <DataPanelLarge>
          <Peers />
        </DataPanelLarge>
      </div>
    </div>
  )
}

export default AllPeersPage;