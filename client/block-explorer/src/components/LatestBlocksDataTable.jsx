import { useFetchBlocksQuery } from '../store';
import { Dna } from 'react-loader-spinner';
import DataTable from './DataTable';

const getTime = (date, dateCreated) => {
  let timeElapsed = date - dateCreated;

  if (( timeElapsed / 1000 ) > 0 && ( timeElapsed / 1000 ) < 60 ){
    timeElapsed = `${ Math.round(timeElapsed / 1000) } secs ago`;

  } else if (( timeElapsed / 60000 ) >= 1 && ( timeElapsed / 60000 ) < 60) {
    timeElapsed = `${ Math.round(timeElapsed / 60000) } min ago`;

  } else if (( timeElapsed / 3600000 ) >= 1 && ( timeElapsed / 3600000 ) < 24) {
    timeElapsed = `${ Math.round(timeElapsed / 3600000) } hrs ago`;

  } else if (( timeElapsed / 86400000 ) >= 1 && ( timeElapsed / 86400000 ) < 7) {
    timeElapsed = `${ Math.round(timeElapsed / 86400000) } days ago`;

  } else if (( timeElapsed / 604800000 ) >= 1 && ( timeElapsed / 604800000 ) < 4) {
    timeElapsed = `${ Math.round(timeElapsed / 604800000) } weeks ago`;

  } else if (( timeElapsed / 2629746000 ) >= 1 && ( timeElapsed / 2629746000 ) < 12) {
    timeElapsed = `${ Math.round(timeElapsed / 2629746000) } months ago`;

  } else if (( timeElapsed / 31556952000 ) >= 1 && ( timeElapsed / 31556952000 ) < 99) {
    timeElapsed = `${ Math.round(timeElapsed / 31556952000) } years ago`;

  } else {
    timeElapsed = "error...";
    
  }

  return timeElapsed;
}

const LatestBlocksDataTable = () => {
  const { data, error, isFetching } = useFetchBlocksQuery();

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
      const timeElapsed = getTime(date, dateCreated);
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