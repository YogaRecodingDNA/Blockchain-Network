import { useState } from 'react';
import axios from "axios";
import moonExplorer from "../assets/images/moonExplorer.jpeg";
import SearchBar from "../components/SearchBar";
import Table from "../components/Table";

const ExplorerPage = () => {
  const [info, setInfo] = useState({});

  const handleSubmit = async () => {
    // event.preventDefault();
    await axios.get("http://localhost:5555/blocks")
    .then( data => {
      data = data.data;
      const newInfo = {
        ...info,
        data
      }
      setInfo(newInfo);
      console.log(info);
    }).catch( err => console.error(err));
  }


  return (
    <div className="bg-cover bg-fixed w-full h-full" style={{ backgroundImage: `url(${moonExplorer})`}} >
      <div className="w-full h-full bg-gradient-to-b from-gray-900 via-transparent text-white">
        <div className="pt-10">
          <div className="ml-auto w-10/12">
            <h1 className="text-xl font-normal">The Vinyasachain Block Explorer</h1>
          </div>
          <div className="flex items-start w-10/12 mt-4 ml-auto">
            <SearchBar onSubmit={handleSubmit} />
          </div>
        </div>
        <div className="border flex w-full space-x-4 h-96 px-3 mt-20 mx-auto">
          <div className="w-1/2">
            <Table blockData={info} />
          </div>
          <div className="w-1/2">
            <Table blockData={info} />
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