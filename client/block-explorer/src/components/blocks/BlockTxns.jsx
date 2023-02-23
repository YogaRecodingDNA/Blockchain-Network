// HOOKS
import useGetTime from '../../hooks/use-getTime';
// COMPONENTS
import HashLink from '../navigation/HashLink';
import TableFooter from '../TableFooter';
// ASSETS/ICONS/STATUS COMPONENTS
import { BsFillArrowRightSquareFill } from "react-icons/bs";

const truncateHash = (hash) => {
  return `${hash.slice(0, 19)}...`
}

const BlockTxns = ({ txns }) => {
  const { getElapsed } = useGetTime();
  // const data = linkData;

  console.log("Link Data Blck Txns", txns);

  let transactionData;
  
  transactionData = txns.map(txn => {
    const date = Date.now();
    const dateCreated = +new Date(txn.dateCreated);
    const timeElapsed = getElapsed(date, dateCreated);

    return (
      <tr key={txn.transactionDataHash} className="text-left text-white hover:bg-violet-400/50">
            <td className="px-4 py-4 w-full">
                <HashLink to="/singleTxn" linkData={txn.transactionDataHash}>{truncateHash(txn.transactionDataHash)}</HashLink>
            </td>
            <td className="px-4 py-4 text-xs font-semibold truncate">
                {timeElapsed}
            </td>
            <td className="px-4 py-4 truncate">
                <HashLink to="/userAddress" linkData={txn.from}>{truncateHash(txn.from)}</HashLink>
            </td>
            <td className="px-4 py-4 text-xl text-transparent/60">
              <div>
                <BsFillArrowRightSquareFill className="border border-transparent/40 rounded bg-emerald-600" />
              </div>
            </td>
            <td className="px-4 py-4 truncate">
                <HashLink to="/userAddress" linkData={txn.to}>{truncateHash(txn.to)}</HashLink>
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

  console.log("transactionData", transactionData.length)

  return (
      <table className="border table-auto w-full text-center text-xs text-white">
        <thead className='text-left px-6 py-5 h-14 font-normal bg-gradient-to-b from-cyan-900 via-cyan-900'>
          <tr>
            <th className="pl-4" scope="col">Txn Hash</th>
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
            <TableFooter numberOfCells={7} />
          </tr>
        </tfoot>
      </table>
  )
}

export default BlockTxns;