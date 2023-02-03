import { useFetchBlocksQuery } from '../store';
import { Dna } from 'react-loader-spinner';

const Blocks = () => {
  const { data, error, isFetching } = useFetchBlocksQuery();

  console.log(data);

  let content;

  if (isFetching) {
    content = <Dna
      visible={true}
      height="80"
      width="80"
      ariaLabel="dna-loading"
      wrapperStyle={{}}
      wrapperClass="dna-wrapper"
    />;
  } else if (error) {
    content = <div>Error loading blocks.</div>
  } else {
    content = data.map(block => {
      return (
        <tr key={block.index}>
        <td>{block.index}</td>
        <td>
          <a style={{color: 'blue'}} href="./">{block.blockHash.slice(0, 11) + "..."}</a>
        </td>
        <td>{block.transactions.length}</td>
        <td>{block.dateCreated}</td>
      </tr>
      )
    })
  }

  return (
    <div> BLOCKS ======================================
      <table>
        <thead>
          <tr>
            <th>Block Number | </th>
            <th>Block Hash | </th>
            <th>Number of Txs | </th>
            <th>Creation Date</th>
          </tr>
        </thead>
        <tbody>
          {content}
        </tbody>
      </table>
    </div>
  )
}

export default Blocks;