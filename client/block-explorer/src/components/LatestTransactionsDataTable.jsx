import { useFetchPendingTransactionsQuery } from '../store';
import useGetTime from '../hooks/use-getTime';
import { Dna } from 'react-loader-spinner';
import DataTable from './DataTable';


const LatestTransactionsDataTable = () => {
  const { data, error, isFetching } = useFetchPendingTransactionsQuery();
  const { getElapsed } = useGetTime();

  let transactionData;

  if (isFetching) {
    transactionData = (
      <tr className="pl-9">
        <td>
          <Dna
            visible={true}
            height="80"
            width="80"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
          />;
        </td>
      </tr>
    );

  } else if (error) {
    transactionData = <div>Error loading transactions.</div>;

  } else {
    transactionData = data.map(tx => {
      const date = Date.now();
      const dateCreated = +new Date(tx.dateCreated);
      const timeElapsed = getElapsed(date, dateCreated);
      const amount = tx.value / 1000000;

      return (
        <DataTable key={tx.transactionDataHash} txHash={tx.transactionDataHash} to={tx.to} from={tx.from} amount={amount} dateCreated={timeElapsed}/>
      );

    });

    transactionData = transactionData.reverse();
    console.log(transactionData);

  };

  return (
    <div>
        <div className="sticky w-full pl-6 py-5 top-0 font-semibold bg-cyan-900">
            Latest Transactions
        </div>
        <table className="table-fixed w-full text-left text-sm text-white">
            <tbody>
                {transactionData}
            </tbody>
        </table>
    </div>
  )
}

export default LatestTransactionsDataTable;