import { useFetchPendingTransactionsQuery } from '../store';
import useGetTime from '../hooks/use-getTime';
import DataTable from './DataTable';
import { Dna } from 'react-loader-spinner';

const LatestTxnsPendingExplorer = () => {
  const { data,error,isFetching } = useFetchPendingTransactionsQuery();
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
        <DataTable key={tx.transactionDataHash} transaction={tx} dateCreated={timeElapsed}/>
        // <DataTable key={tx.transactionDataHash} txHash={tx.transactionDataHash} to={tx.to} from={tx.from} amount={amount} dateCreated={timeElapsed}/>
      );

    });

    if (transactionData.length === 0) {
      return <h1 className="px-5">There are no pending transactions.</h1>
    }

    transactionData = transactionData.reverse();

  };

  return (
    <div>
        <table className="table-fixed w-full text-left text-sm text-white">
            <tbody>
                {transactionData}
            </tbody>
        </table>
    </div>
  )
}

export default LatestTxnsPendingExplorer;