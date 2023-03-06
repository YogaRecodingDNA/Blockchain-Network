import { useFetchBlocksQuery } from '../../store';
import useGetTime from '../../hooks/use-getTime';
import DataTable from '../DataTable';
import LoadingDNA from '../status-indicators/LoadingDNA';

const LatestBlocksDataTable = () => {
  const { data, error, isFetching } = useFetchBlocksQuery();
  const { getElapsed } = useGetTime();

  let blockData;

  if (isFetching) {
    blockData = (
      <tr className="pl-9">
        <td>
          <LoadingDNA />
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
      
      return (
        <DataTable key={block.index} block={block} dateCreated={timeElapsed}/>
      );

    });

    blockData = blockData.reverse();

  };

  return (
    <div>
        <div className="sticky w-full pl-6 pt-2 h-16 top-0 font-semibold bg-gradient-to-b from-cyan-900 via-cyan-900">
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