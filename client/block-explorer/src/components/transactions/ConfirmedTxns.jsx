import { useFetchConfirmedTransactionsQuery } from '../../store';
import useGetTime from '../../hooks/use-getTime';
import HashLink from '../navigation/HashLink';
import { Dna } from 'react-loader-spinner';
import { BsFillArrowRightSquareFill } from "react-icons/bs";

const truncateHash = (hash) => {
  return `${hash.slice(0, 19)}...`
}

const ConfirmedTxns = () => {
  const { data, error, isFetching } = useFetchConfirmedTransactionsQuery();
  const { getElapsed } = useGetTime();

  console.log(data);

  let transactionData;

  if (isFetching) {
    transactionData = (
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
  } else if (error) {
    transactionData = <div>Error loading blocks.</div>
  } else {
    transactionData = data.map(txn => {
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
              <td className="px-4 py-4 text-sm font-medium truncate">
                  {txn.value + " PRANA"}
              </td>
              <td className="px-4 py-4 text-xs font-light truncate">
                  {txn.fee / 1000000 + " NYASA"}
              </td>
          </tr>
      );
    });
    
    transactionData = transactionData.reverse();

  }

  const tableFoot = (length) => {
    let footArray = [];
    for (let i = 0; i < length; i++){
      footArray.push(
        <td className="h-10 w-full bg-gradient-to-b from-transparent via-cyan-900 to-cyan-900"></td>
      )
    }

    return footArray;
  }


  return (
      <table className="border table-auto w-full text-center text-xs text-white">
        <thead className='text-left px-6 py-5 h-14 font-normal bg-gradient-to-b from-cyan-900 via-cyan-900'>
          <tr>
            <th className="pl-4" scope="col">Txn Hash</th>
            <th className="pl-4" scope="col">Block</th>
            <th className="pl-4" scope="col">Age</th>
            <th className="pl-4" scope="col">From</th>
            <th className="pl-4" scope="col"></th>
            <th className="pl-4" scope="col">To</th>
            <th className="pl-4" scope="col">Value</th>
            <th className="pl-4" scope="col">Txn Fee</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
            {transactionData}
        </tbody>
        <tfoot>
            <tr>
              {tableFoot(8)}
            </tr>
        </tfoot>
      </table>
  )
}

export default ConfirmedTxns;