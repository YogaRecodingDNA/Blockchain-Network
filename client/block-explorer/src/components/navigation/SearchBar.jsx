// HOOKS
import { useNavigate } from "react-router-dom";
import { useFetchAllTransactionsQuery, useFetchBlocksQuery } from "../../store";
// COMPONENTS
import Button from "../Button";
// ASSETS
import { FaSearch } from 'react-icons/fa'

const SearchBar = () => {
  const navigate = useNavigate();
  const {
    data: txnsData,
    error: txnsError,
    isFetching: txnsIsFetching
  } = useFetchAllTransactionsQuery();
  console.log("SEARCHBAR TXN DATA", txnsData);

  const {
    data: blocksData,
    error: blocksError,
    isFetching: blocksIsFetching
  } = useFetchBlocksQuery();

  console.log("SEARCHBAR BLOCK DATA", blocksData);

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const query = event.currentTarget.elements.searchBar.value;
    const isAddress = /^[A-Fa-f0-9]{1,40}$/g.test(query);
    const isBlockOrTxn = /^[A-Fa-f0-9]{1,64}$/g.test(query);

    if (isAddress) {
      navigate("/userAddress", { state: {linkData: query}});

    } else if (isBlockOrTxn) {
      const blockHash = blocksData.filter(block => block.blockHash === query);
      const txnHash = txnsData.filter(txn => txn.transactionDataHash === query);

      if (blockHash.length > 0) {
        navigate("/singleBlock", { state: {linkData: query}});

      }
      
      if (txnHash.length > 0) {
        navigate("/singleTxn", { state: {linkData: query}});

      }
    }

    return;
  }
  
  return (
    <div className="w-full">
      <form onSubmit={handleFormSubmit} className="flex justify-start items-stretch w-full h-11">
        <input id="searchBar" className="w-9/12 pl-3 border-none rounded-l-lg text-sm text-gray-900" placeholder='  Search by Address/Txn Hash/Block #' />
        <Button search >
          <FaSearch />
        </Button>
      </form>
    </div>
  )
}

export default SearchBar;