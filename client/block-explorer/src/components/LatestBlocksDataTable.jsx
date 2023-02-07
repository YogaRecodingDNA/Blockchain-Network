import { useFetchBlocksQuery } from '../store';
import useGetTime from '../hooks/use-getTime';
import { Dna } from 'react-loader-spinner';
import DataTable from './DataTable';


const LatestBlocksDataTable = () => {
  const { data, error, isFetching } = useFetchBlocksQuery();
  const { getElapsed } = useGetTime();

  let blockData;

  if (isFetching) {
    blockData = (
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
    blockData = <div>Error loading blocks.</div>;

  } else {
    blockData = data.map(block => {
      const date = Date.now();
      const dateCreated = +new Date(block.dateCreated);
      const timeElapsed = getElapsed(date, dateCreated);
      const transactions = block.transactions;
      let reward = 5000000;

      for (let tx of transactions) {
        reward += tx.fee;
      };

      reward = reward / 1000000;

      return (
        <DataTable key={block.index} blockNumber={block.index} minerAddress={block.minedBy} reward={reward} dateCreated={timeElapsed}/>
      );

    });

    blockData = blockData.reverse();
    console.log(blockData);

  };

  return (
    <div>
        <div className="sticky w-full pl-6 py-5 top-0 font-semibold bg-cyan-900">
            Latest Blocks
        </div>
        <table className="table-fixed w-full text-left text-sm text-white">
            <tbody>
                {blockData}
            </tbody>
        </table>
    </div>
  )
}

export default LatestBlocksDataTable;