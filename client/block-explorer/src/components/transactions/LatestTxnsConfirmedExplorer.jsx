// HOOKS
import { useFetchConfirmedTransactionsQuery } from '../../store';
import useGetTime from '../../hooks/use-getTime';
// COMPONENTS
import DataTable from '../DataTable';
// ASSETS/ICONS/STATUS COMPONENTS
import LoadingDNA from '../status-indicators/LoadingDNA';


const LatestTxnsConfirmedExplorer = () => {
  const { data,error,isFetching } = useFetchConfirmedTransactionsQuery();
  const { getElapsed } = useGetTime();
    
  let transactionData;

  if (isFetching) {
    transactionData = (
      <tr className="pl-9">
        <td>
          <LoadingDNA />
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

      return (
        <DataTable key={tx.transactionDataHash} transaction={tx} dateCreated={timeElapsed}/>
      );

    });

    transactionData = transactionData.reverse();
    console.log(transactionData);

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

export default LatestTxnsConfirmedExplorer;