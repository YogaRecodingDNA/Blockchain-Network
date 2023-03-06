// HOOKS
import { useLocation } from "react-router-dom";
import { useFetchPeerInfoQuery } from "../store";
// COMPONENTS
import SearchBar from "../components/navigation/SearchBar";
import PageHead from "../components/PageHead";
import DataPanelLarge from "../components/panels/DataPanelLarge";
import HashLink from "../components/navigation/HashLink";
// ASSETS/ICONS/STATUS COMPONENTS
import moonExplorer from "../assets/images/moonExplorer.jpeg"
import LoadingDNA from "../components/status-indicators/LoadingDNA";

const truncateHash = (hash) => {
  return `${hash.slice(0, 19)}...`
}

const PeerInfoPage = () => {
  const location = useLocation();
  const { linkData } = location.state;
  const { data, error, isFetching } = useFetchPeerInfoQuery(linkData);

  let tableData;

  if (isFetching) {
    tableData = (
      <tr>
        <td>
        <LoadingDNA />
        </td>
      </tr>
    );

  } else if (error) {
    tableData = <div>Error loading peer.</div>

  } else {

    const peerData = [
      {rowHead: "Blockchain", rowData: <HashLink to="/blockchain">{data.about}</HashLink>},
      {rowHead: "Chain ID", rowData: data.chainId},
      {rowHead: "Node ID", rowData: data.nodeId},
      {rowHead: "Node URL", rowData: data.nodeId},
      {rowHead: "Blocks", rowData: data.blocksCount},
      {rowHead: "Connected Peers", rowData: data.peersTotal - 1},
      {rowHead: "Current Difficulty", rowData: data.currentDifficulty},
      {rowHead: "Cumulative Difficulty", rowData: data.cumulativeDifficulty},
      {rowHead: "Txns Confirmed", rowData: data.confirmedTransactions},
      {rowHead: "Txns Pending", rowData: data.pendingTransactions},
    ];

    tableData = peerData.map( (item, index) => {

      return (
        <tr key={index} className="text-left text-white hover:bg-violet-400/50">
          <th className="pl-4 pr-10 py-4 text-gray-300 font-medium">
            {item.rowHead}:
          </th>
          <td className="px-4 py-4">
            {item && item.rowData}
          </td>
        </tr>
      );
    });
  }

  return (
    <div className="flex overflow-auto bg-cover bg-fixed w-full h-full" style={{ backgroundImage: `url(${moonExplorer})`}}>
      <div className="w-full h-full bg-gradient-to-b from-gray-900 via-transparent text-white">
        <div>
          <div className="flex items-start w-10/12 ml-auto">
            <SearchBar />
          </div>
        </div>
        <div>
          <PageHead>Peer:
              <button className="ml-2 text-normal font-normal text-teal-400 md:hidden">
                {data && truncateHash(data.nodeId)}
              </button>
              <button className="hidden ml-2 text-normal font-normal text-teal-400 md:inline">
                {data && data.nodeId}
              </button>
          </PageHead>
        </div>
        <DataPanelLarge>
          <table className="border table-auto w-full text-center text-xs text-white">
            <thead className='px-6 py-5 h-14 text-lg text-left font-normal text-white bg-gradient-to-b from-cyan-900 via-cyan-900'>
              <tr>
                <td className="w-48 pl-4">Peer Node Details</td>
                <td></td>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-700">
                {tableData}
            </tbody>
            <tfoot className="h-10 w-full bg-gradient-to-b from-transparent via-cyan-900 to-cyan-900">
                <tr>
                  <td></td>
                  <td></td>
                </tr>
            </tfoot>
          </table>
        </DataPanelLarge>
      </div>
    </div>
  );
}

export default PeerInfoPage;