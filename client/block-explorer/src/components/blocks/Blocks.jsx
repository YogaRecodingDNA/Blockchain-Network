// HOOKS
import { useFetchBlocksQuery } from '../../store';
import useGetTime from '../../hooks/use-getTime';
// COMPONENTS
import HashLink from '../navigation/HashLink';
// ASSETS
import { Dna } from 'react-loader-spinner';

const truncateHash = (hash) => {
  return `${hash.slice(0, 19)}...`
}

const Blocks = () => {
  const { data, error, isFetching } = useFetchBlocksQuery();
  const { getElapsed } = useGetTime();

  let blockData;

  if (isFetching) {
    blockData = (
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
    blockData = <div>Error loading blocks.</div>
  } else {
    blockData = data.map(block => {
      const date = Date.now();
      const dateCreated = +new Date(block.dateCreated);
      const timeElapsed = getElapsed(date, dateCreated);
      const reward = block.transactions[0].value / 1000000;

      return (
        <tr key={block.index} className="text-left text-white bg-transparent hover:bg-violet-400/50">
              <td className="px-12 py-4 items-center">
                <HashLink to="/userAddress" linkData={block.index}>{block.index}</HashLink>
              </td>
              <td className="px-10 py-4 text-xs font-semibold truncate">
                  {timeElapsed}
              </td>
              <td className="px-10 py-4 truncate">
                  <HashLink to="/">{block.transactions.length}</HashLink>
              </td>
              <td className="px-10 py-4 truncate">
                  <HashLink to="/userAddress" linkData={block.minedBy}>
                    {truncateHash(block.minedBy)}
                  </HashLink>
              </td>
              <td className="px-10 text-xs text-shadow-md">
                  {reward + " PRANA"}
              </td>
          </tr>
      );
    });
    
    blockData = blockData.reverse();
  }

  console.log(data);


  return (
    <div>
      <table className="table-auto w-full text-left text-sm text-white">
        <thead className='px-6 py-5 h-14 font-normal bg-gradient-to-b from-cyan-900 via-cyan-900'>
          <tr>
            <th className="px-12 py-5" scope="col">Block</th>
            <th className="px-10 py-5" scope="col">Age</th>
            <th className="px-10 py-5" scope="col">Txns</th>
            <th className="px-10 py-5" scope="col">Fee Recipient</th>
            <th className="px-10 py-5" scope="col">Block Reward</th>
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