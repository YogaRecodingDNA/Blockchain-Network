import { useFetchPendingTransactionsQuery } from '../../store';
import useGetTime from '../../hooks/use-getTime';
import DataTable from '../DataTable';
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
    transactionData = data.map(txn => {
      const date = Date.now();
      const dateCreated = +new Date(txn.dateCreated);
      const timeElapsed = getElapsed(date, dateCreated);

      return (
        <DataTable key={txn.transactionDataHash} transaction={txn} dateCreated={timeElapsed}/>
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