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

const Blocks = ({ nodeUrl }) => {
  const { getElapsed } = useGetTime();
  const { data, error, isFetching } = useFetchBlocksQuery(nodeUrl);

  let blockInfo;

  if (isFetching) {
    blockInfo = (
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
    blockInfo = <div>Error loading blocks.</div>
  } else {
    blockInfo = data.map(block => {
      const date = Date.now();
      const dateCreated = +new Date(block.dateCreated);
      const timeElapsed = getElapsed(date, dateCreated);
      const reward = block.transactions[0].value / 1000000;

      return (
        <tr key={block.index} className="text-left text-white bg-transparent hover:bg-violet-400/50">
              <td className="px-12 py-4 items-center">
                <HashLink to="/singleBlock" linkData={block.index}>{block.index}</HashLink>
              </td>
              <td className="px-10 py-4 text-xs font-semibold truncate">
                  {timeElapsed}
              </td>
              <td className="px-10 py-4 truncate">
              {block.transactions.length}
                  {/* <HashLink to="/">{block.transactions.length}</HashLink> */}
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
    
    blockInfo = blockInfo.reverse();
  }

  return (
    <div>
      <div className='flex border-gray-700 items-center px-6 pt-7 h-10 bg-cyan-900'>
        <h2 className="">All Blocks</h2>
        <p className="ml-3 text-xs text-gray-400 font-medium">{`${data && data.length} TOTAL BLOCKS`}</p>
      </div>
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
            {blockInfo}
        </tbody>
      </table>
      <div className='px-6 py-5 h-10 font-semibold bg-gradient-to-t from-cyan-900 via-cyan-900'>
      </div>
    </div>
  )
}

export default Blocks;