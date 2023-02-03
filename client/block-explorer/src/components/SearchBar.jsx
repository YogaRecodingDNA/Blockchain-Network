import axios from "axios";
import { useState } from "react";

const SearchBar = () => {
  const [info, setInfo] = useState({});

  const handleClick = (event) => {
    event.preventDefault();
    axios.get("http://localhost:5555/info")
    .then( data => {
      data = data.data;
      const newInfo = {
        ...info,
        data
      }
      setInfo(newInfo);
    }).catch( err => console.error(err));
  }
  console.log(info);
  
  return (
    <div>
      <form>
        <input placeholder='Search by Address/Txn Hash/Block #' />
        <span>
          <button onClick={handleClick}>search</button>
        </span>
      </form>
    </div>
  )
}

export default SearchBar;