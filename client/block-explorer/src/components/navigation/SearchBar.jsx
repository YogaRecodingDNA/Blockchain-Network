// import axios from "axios";
// import { useState } from "react";
import Button from "../Button";
import { FaSearch } from 'react-icons/fa'

const SearchBar = ({ onSubmit }) => {
  // const [info, setInfo] = useState({});

  const handleFormSubmit = (event) => {
    event.preventDefault();
    onSubmit();
  }
  // console.log(info);
  
  return (
    <div className="w-full">
      <form onSubmit={handleFormSubmit} className="flex justify-start items-stretch w-full h-11">
        <input className="w-9/12 border-none rounded-l-lg text-sm text-gray-900" placeholder='  Search by Address/Txn Hash/Block #' />
        <Button search >
          <FaSearch />
        </Button>
      </form>
    </div>
  )
}

export default SearchBar;