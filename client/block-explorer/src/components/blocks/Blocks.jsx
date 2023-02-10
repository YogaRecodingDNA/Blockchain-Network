import { useFetchBlocksQuery } from '../../store';
import useGetTime from '../../hooks/use-getTime';
import { Link } from 'react-router-dom';
import { Dna } from 'react-loader-spinner';

const Blocks = () => {
  const { data, error, isFetching } = useFetchBlocksQuery();
  const { getElapsed } = useGetTime();

  console.log(data);

  let blockData;

  if (isFetching) {
    blockData = <Dna
      visible={true}
      height="80"
      width="80"
      ariaLabel="dna-loading"
      wrapperStyle={{}}
      wrapperClass="dna-wrapper"
    />;
  } else if (error) {
    blockData = <div>Error loading blocks.</div>
  } else {
    blockData = data.map(block => {
      const date = Date.now();
      const dateCreated = +new Date(block.dateCreated);
      const timeElapsed = getElapsed(date, dateCreated);
      const reward = block.transactions[0].value / 1000000;

      return (
        <tr className="text-white bg-transparent hover:bg-violet-400/50">
              <th className="px-3 py-4 w-full items-center">
                  <Link to="/" className="text-sm font-normal text-teal-400">
                    {block.index}
                  </Link>
              </th>
              <td className="px-3 py-4 text-xs font-semibold truncate">
                  {timeElapsed}
              </td>
              <td className="px-3 py-4 text-sm font-normal text-teal-400 truncate">
                  <Link to="/">{block.transactions.length}</Link>
              </td>
              <td className="px-3 py-4 text-sm font-normal text-teal-400 truncate">
                  <Link to="/">{block.minedBy}</Link>
              </td>
              <td className="">
                  <div className="mr-3 pr-3 text-right text-xs rounded-full bg-gradient-to-l from-gray-500/75">
                      {reward + " PRANA"}
                  </div>
              </td>
          </tr>
      );
    });
    
    blockData = blockData.reverse();
  }


  return (
    <div>
      <table className="table-fixed w-full text-center text-sm text-white">
        <thead className='px-6 py-5 h-14 font-normal bg-gradient-to-b from-cyan-900 via-cyan-900'>
          <tr>
            <th scope="col">Block</th>
            <th scope="col">Age</th>
            <th scope="col">Txn</th>
            <th scope="col">Fee Recipient</th>
            <th scope="col">Block Reward</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
            {blockData}
        </tbody>
      </table>
      <div className='px-6 py-5 h-10 font-semibold bg-gradient-to-t from-cyan-900 via-cyan-900'>
      </div>
    </div>
  )
}

export default Blocks;