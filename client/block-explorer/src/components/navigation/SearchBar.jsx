// HOOKS
import { useNavigate } from "react-router-dom";
import { useFetchAllTransactionsQuery, useFetchBlocksQuery } from "../../store";
// COMPONENTS
import Button from "../Button";
// ASSETS/ICONS/STATUS COMPONENTS
import { FaSearch } from 'react-icons/fa'

const SearchBar = () => {
  const navigate = useNavigate();
  const { data: blocksData } = useFetchBlocksQuery();
  const { data: txnsData } = useFetchAllTransactionsQuery();

  const handleFormSubmit = (event) => {
    event.preventDefault();
    let query = event.currentTarget.elements.searchBar.value;
    const isBlock = /(?:\b|-)([1-9]{1,4}[0]?|100)\b/g.test(query);
    const isAddress = /^[A-Fa-f0-9]{40}$/g.test(query);
    const isTransaction = /^[A-Fa-f0-9]{64}$/g.test(query);

    if (blocksData && isBlock) {
      const targetBlock = +query + 1;
        if (targetBlock <= blocksData.length + 1) {
          navigate("/singleBlock", { state: {linkData: targetBlock}});

        }
  
      } else if (blocksData && isTransaction) {
        const txnHash = txnsData.filter(txn => txn.transactionDataHash === query);
        
        if (txnHash.length > 0) {
          navigate("/singleTxn", { state: {linkData: query}});
        }
  
      } else if (blocksData && isAddress) {
        navigate("/userAddress", { state: {linkData: query}});
  
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