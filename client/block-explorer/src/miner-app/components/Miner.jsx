// HOOKS
import { useFetchAllPeersQuery } from '../../store';
// COMPONENTS
import Button from '../../components/Button';
import HashLink from '../../components/navigation/HashLink';
import StatusCurrentNode from '../../components/status-indicators/StatusCurrentNode';
// ASSETS
import { GiMining } from "react-icons/gi";
import { Dna } from 'react-loader-spinner';

const Miner = () => {
  const currentUrl = "http://localhost:5555";
  const { data, error, isFetching } = useFetchAllPeersQuery();

  let peerData;

  if (isFetching) {
    peerData = (
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
    peerData = <div>Error loading peer nodes.</div>
  } else {
    let count = 1;
    peerData = [];
    for (let node in data) {
      const nodeId = node;
      const nodeUrl = data[node];

      peerData.push(
        <tr key={nodeId} className="text-left text-white bg-transparent hover:bg-violet-400/50">
              <td className="flex space-x-10 px-16 py-4 text-xs font-semibold items-center">
                <HashLink to="/peers/details" linkData={nodeUrl}>
                  { count === 1 ? "Genesis" : "Node " + count }
                </HashLink>
                {(currentUrl === nodeUrl) && <StatusCurrentNode />}
              </td>
              <td className="px-12 py-4 truncate">
                <HashLink to="/peers/details" linkData={nodeUrl}>
                  {nodeId}
                </HashLink>
              </td>
              <td className="px-10 py-4 text-xs font-semibold truncate">
                  {nodeUrl}
              </td>
              <td className="px-10 py-4 text-xs font-semibold truncate">
                  <Button primary >
                    Mine
                  <GiMining className="ml-1 text-lg text-white" /></Button>
              </td>
          </tr>
      );

      count++;
    };
  }

  return (
    <div>
      <div className='flex w-full items-center px-6 py-7 h-10 bg-cyan-900'>
        <h2 className="ml-2 text-3xl">Mining</h2>
        {/* <p className="ml-3 text-xs text-gray-400 font-medium">{`${data && peerData.length} TOTAL NODES`}</p> */}
      </div>
      <table className="table-auto w-full text-left text-sm text-white">
        <thead className='px-6 py-5 h-14 font-normal bg-gradient-to-b from-cyan-900 via-cyan-900'>
          <tr>
            <th className="px-16 py-5" scope="col">PEER</th>
            <th className="px-12 py-5" scope="col">Node I.D.</th>
            <th className="px-10 py-5" scope="col">Node URL</th>
            <th className="px-10 py-5" scope="col">Mine New Block</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
            {peerData}
        </tbody>
      </table>
      <div className='px-6 py-5 h-10 font-semibold bg-gradient-to-t from-cyan-900 via-cyan-900'>
      </div>
    </div>
  )
}

export default Miner;