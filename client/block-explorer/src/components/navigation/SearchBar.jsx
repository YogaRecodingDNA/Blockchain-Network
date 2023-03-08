// HOOKS
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useFetchAllTransactionsQuery, useFetchBlocksQuery, useFetchAllBalancesQuery } from "../../store";
// COMPONENTS
import Button from "../Button";
// ASSETS/ICONS/STATUS COMPONENTS
import { FaSearch } from 'react-icons/fa'

const SearchBar = () => {
  const navigate = useNavigate();
  const [ isInvalid, setIsInvalid ] = useState(false);
  const { data: blocks } = useFetchBlocksQuery();
  const { data: addresses } = useFetchAllBalancesQuery();
  const { data: txns } = useFetchAllTransactionsQuery();

  const handleFormSubmit = (event) => {
    event.preventDefault();
    let query = event.currentTarget.elements.searchBar.value;
    console.log("QUERY ======", query);
    console.log("ADDRESSES ======", addresses);
    const isBlock = /(?:\b|-)([1-9]{1,4}[0]?|100)\b/g.test(query);
    const isAddress = /^[A-Fa-f0-9]{40}$/g.test(query);
    const isHash = /^[A-Fa-f0-9]{64}$/g.test(query);
    console.log("isBLOCK ======", isBlock);
    console.log("isAddress ======", isAddress);
    console.log("isHash ======", isHash);
    console.log("BlockHASH LENGTH ======", blocks);
    console.log("ADDRESS HAS QUERY?? ======", addresses.hasOwnProperty(query));
    
    if (blocks && isBlock) {
      const targetBlock = +query;
      
      if (targetBlock <= blocks.length + 1) {
        navigate("/singleBlock", { state: {linkData: targetBlock}});
      }
      
    } else if (blocks && isHash) {
      const txnHash = txns.filter(txn => txn.transactionDataHash === query);
      console.log("txnHash ======", txnHash);
      const blockHash = blocks.filter(block => block.blockHash === query);
      console.log("blockHash ======", blockHash);
      
      if ((txnHash.length > 0) && (txnHash[0].transactionDataHash === query)) {
        navigate("/singleTxn", { state: {linkData: query}});
      } else if ((blockHash.length > 0) && (blockHash[0].blockHash === query)) {
        query = blocks.filter(block => block.blockHash === query)[0].index;
        console.log("block number query blockHash ======", query);

        navigate("/singleBlock", { state: {linkData: query}});
      } else {
        setIsInvalid(true);
      }

    } else if (blocks && isAddress) {
      if (addresses.hasOwnProperty(query)) {
        navigate("/userAddress", { state: {linkData: query}});
      } else {
        setIsInvalid(true);
      }

    } else {
      setIsInvalid(true);
    }
      
    return;
  }
  

  return (
    <div className="w-full h-20">
      <form onSubmit={handleFormSubmit} className="flex justify-start items-stretch w-full h-10">
        <input
          type="search"
          id="searchBar"
          className="w-9/12 pl-3 border-none rounded-l-lg text-sm text-gray-900"
          placeholder='  Search by Address/Txn Hash/Block #' />
        <Button search >
          <FaSearch />
        </Button>
      </form>
      {isInvalid &&
      <Button
        error
        onClick={() => setIsInvalid(false)}
        className="w-3/4 h-8 mt-1"
      >
          Invalid Credentials: Please enter a valid Address, Transaction Hash, or Block Number
      </Button>}
    </div>
  )
}

export default SearchBar;