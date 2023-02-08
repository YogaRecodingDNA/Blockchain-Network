import moonExplorer from "../assets/images/moonExplorer.jpeg";
import SearchBar from "../components/SearchBar";
import LatestBlocksDataTable from "../components/LatestBlocksDataTable";
import LatestTransactionsDataTable from "../components/LatestTransactionsDataTable";


const ExplorerPage = () => {

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
        <div className="hidden w-full h-96 px-3 mt-20 mx-auto space-x-4 rounded-lg md:flex">
          <div className="overflow-y-auto w-1/2 rounded-lg bg-gray-700/40 shadow-md">
            <LatestBlocksDataTable />
          </div>
          <div className="overflow-auto w-1/2 rounded-lg bg-gray-700/40 shadow-md">
            <LatestTransactionsDataTable />
          </div>
        </div>
        <div className="w-full h-full px-3 mt-20 mx-auto space-y-4 rounded-lg md:hidden">
          <div className="overflow-y-auto w-full h-96 rounded-lg bg-gray-700/40 shadow-md">
            <LatestBlocksDataTable />
          </div>
          <div className="overflow-auto w-full h-96 rounded-lg bg-gray-700/40 shadow-md">
            <LatestTransactionsDataTable />
          </div>
        </div>
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