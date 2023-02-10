import Blocks from "../components/blocks/Blocks";
import moonExplorer from "../assets/images/moonExplorer.jpeg";
import SearchBar from "../components/navigation/SearchBar";

const BlocksPage = () => {

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
        <div className="w-full h-max px-12 mt-20 mx-auto space-y-4 rounded-lg">
          <div className="overflow-y-auto w-full h-max rounded-lg bg-gray-900/40 shadow-md">
            <Blocks />
          </div>
        </div>
      </div>
    </div>
  )
}

export default BlocksPage;