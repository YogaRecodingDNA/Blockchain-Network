import { useLocation } from "react-router-dom";
import { useFetchTransactionsByAddressQuery, useFetchBalancesByAddressQuery } from "../store";
import useGetTime from "../hooks/use-getTime";
import SearchBar from "../components/navigation/SearchBar";
import PageHead from "../components/PageHead";
import HeadPanelHalf from "../components/panels/HeadPanelHalf";
import DataPanelLarge from "../components/panels/DataPanelLarge";
import HashLink from "../components/navigation/HashLink";
import moonExplorer from "../assets/images/moonExplorer.jpeg"
import { BsFillArrowRightSquareFill } from "react-icons/bs";
import { Dna } from 'react-loader-spinner';

const truncateHash = (hash) => {
  return `${hash.slice(0, 19)}...`
}

const AddressPage = () => {
  const location = useLocation();
  const { linkData } = location.state;
  const { getElapsed } = useGetTime();

  const {
    data: txnData,
    error: txnError,
    isFetching: txnIsFetching
  } = useFetchTransactionsByAddressQuery(linkData);
  const {
    data: balanceData,
    error: balanceError,
    isFetching: balanceIsFetching
  } = useFetchBalancesByAddressQuery(linkData);

  console.log("TXN HASH ", linkData);
  console.log("BALANCE BY HASH ======== DATA", balanceData);
  console.log("Txns BY Address ======== DATA", txnData);

  const handleSubmit = () => {
    return;
  }

  let tableData;

  if (txnIsFetching) {
    tableData = (
      <tr>
        <td>
          <Dna
            visible={true}
            height="80"
            width="80"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
          />
        </td>
      </tr>
    );

  } else if (txnError) {
    tableData = <div>Error loading blocks.</div>

  } else {
    const addressHistory = txnData.addressHistory;
    tableData = addressHistory.map( txn => {

      const date = Date.now();
      const dateCreated = +new Date(txn.dateCreated);
      const timeElapsed = getElapsed(date, dateCreated);

      return (
        <tr key={txn.transactionDataHash} className="text-left text-white hover:bg-violet-400/50">
              <td className="px-4 py-4 w-full">
                  <HashLink to={`singleTxn/${txn.transactionDataHash}`}>{truncateHash(txn.transactionDataHash)}</HashLink>
              </td>
              <td className="px-4 py-4 text-xs font-semibold truncate">
                  <HashLink to="/">{txn.minedInBlockIndex}</HashLink>
              </td>
              <td className="px-4 py-4 text-xs font-semibold truncate">
                  {timeElapsed}
              </td>
              <td className="px-4 py-4 truncate">
                  <HashLink to="/">{truncateHash(txn.from)}</HashLink>
              </td>
              <td className="px-4 py-4 text-xl text-transparent/60">
                <div>
                  <BsFillArrowRightSquareFill className="border border-transparent/40 rounded bg-emerald-600" />
                </div>
              </td>
              <td className="px-4 py-4 truncate">
                  <HashLink to="/">{truncateHash(txn.to)}</HashLink>
              </td>
              <td className="px-4 py-4 text-sm font-normal truncate">
                  {txn.value + " PRANA"}
              </td>
              <td className="px-4 py-4 text-xs font-light truncate">
                  {txn.fee / 1000000 + " NYASA"}
              </td>
          </tr>
      );
    });
    
    tableData = tableData.reverse();
  }

  return (
    <div className="flex overflow-auto bg-cover bg-fixed w-full h-full" style={{ backgroundImage: `url(${moonExplorer})`}}>
      <div className="w-full h-full bg-gradient-to-b from-gray-900 via-transparent text-white">
        <div>
          <div className="flex items-start w-10/12 ml-auto">
            <SearchBar onSubmit={handleSubmit} />
          </div>
        </div>
        <PageHead>Address:
          <HashLink to="/userAddress" linkData={txnData && txnData.address}>
            {txnData && ` ${txnData.address}`}
          </HashLink>
        </PageHead>
        <div className="flex my-5 mx-5 h-20 space-x-4">
          <HeadPanelHalf title="PRANA BALANCE" data={balanceData && balanceData.addressBalances.safeBalance.toLocaleString()}/>
          <HeadPanelHalf title="TOTAL TRANSACTIONS" data={txnData && txnData.addressHistory.length}/>
        </div>
        <DataPanelLarge>
          <table className="border table-auto w-full text-center text-xs text-white">
            <thead className='px-6 py-5 h-14 text-normal text-left font-normal text-gray-300 bg-gradient-to-b from-cyan-900 via-cyan-900'>
              <tr>
                <th className="pl-4" scope="col">Transaction Hash</th>
                <th className="pl-4" scope="col">Block</th>
                <th className="pl-4" scope="col">Age</th>
                <th className="pl-4" scope="col">From</th>
                <th className="pl-4" scope="col"></th>
                <th className="pl-4" scope="col">To</th>
                <th className="pl-4" scope="col">Value</th>
                <th className="pl-4" scope="col">Txn Fee</th>
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

export default AddressPage;