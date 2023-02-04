import { FaBuromobelexperte, FaPeopleArrows } from "react-icons/fa";

const Table = ({ blockData }) => {

  // console.log(blockData);
  const fetchedBlocks = blockData.data;
  console.log(fetchedBlocks);
  // const block_1 = blocks[0];

  // const renderedBlocks = fetchedBlocks.map((block) => {

  //   return (
  //     <tr className="bg-transparent text-white hover:bg-violet-400/50">
  //         <th scope="row" className="px-3 py-3 text-2xl text-violet-400 whitespace-nowrap">
  //           <FaBuromobelexperte />
  //           {block.blockHash}
  //         </th>
  //         <td className="px-1 py-3">
  //             Sliver
  //         </td>
  //         <td className="px-1 py-3">
  //             Laptop
  //         </td>
  //         <td className="px-1 py-3">
  //             $2999
  //         </td>
  //         <td className="px-1 py-3 text-right">
  //             <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
  //         </td>
  //     </tr>
  //   )
  // });
  
  return (
    <div className="border relative bg-gray-700/40 shadow-md sm:rounded-lg">
        <table className="table-fixed w-full text-xs text-left text-white">
            <thead className="text-xs text-white bg-transparent p-4">
                <tr>
                    <td className="px-3 py-3">
                      Latest Blocks
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr className="bg-transparent text-white hover:bg-violet-400/50">
                    <th scope="row" className="px-3 py-3 text-2xl text-violet-400 whitespace-nowrap">
                      <FaBuromobelexperte />
                    </th>
                    <td className="px-1 py-3">
                    {fetchedBlocks && fetchedBlocks[0].blockHash}
                    </td>
                    <td className="px-1 py-3">
                        Laptop
                    </td>
                    <td className="px-1 py-3">
                        $2999
                    </td>
                    <td className="px-1 py-3 text-right">
                        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                    </td>
                </tr>
                <tr className="bg-transparent text-white hover:bg-violet-400/50">
                    <th scope="row" className="px-3 py-3 text-2xl text-violet-400 whitespace-nowrap">
                      <FaBuromobelexperte />
                    </th>
                    <td className="px-1 py-3">
                        White
                    </td>
                    <td className="px-1 py-3">
                        Laptop PC
                    </td>
                    <td className="px-1 py-3">
                        $1999
                    </td>
                    <td className="px-1 py-3 text-right">
                        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                    </td>
                </tr>
                <tr className="bg-transparent text-white hover:bg-violet-400/50">
                    <th scope="row" className="px-3 py-3 text-2xl text-violet-400 whitespace-nowrap">
                      <FaBuromobelexperte />
                    </th>
                    <td className="px-1 py-3">
                        Black
                    </td>
                    <td className="px-1 py-3">
                        Accessories
                    </td>
                    <td className="px-1 py-3">
                        $99
                    </td>
                    <td className="px-1 py-3 text-right">
                        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                    </td>
                </tr>
                <tr className="bg-transparent text-white hover:bg-violet-400/50">
                    <th scope="row" className="px-3 py-3 text-2xl text-violet-400 whitespace-nowrap">
                      <FaBuromobelexperte />
                    </th>
                    <td className="px-1 py-3">
                        Black
                    </td>
                    <td className="px-1 py-3">
                        Accessories
                    </td>
                    <td className="px-1 py-3">
                        $99
                    </td>
                    <td className="px-1 py-3 text-right">
                        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                    </td>
                </tr>
                <tr className="bg-transparent text-white hover:bg-violet-400/50">
                    <th scope="row" className="px-3 py-3 text-2xl text-violet-400 whitespace-nowrap">
                      <FaBuromobelexperte />
                    </th>
                    <td className="px-1 py-3">
                        Black
                    </td>
                    <td className="px-1 py-3">
                        Accessories
                    </td>
                    <td className="px-1 py-3">
                        $99
                    </td>
                    <td className="px-1 py-3 text-right">
                        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                    </td>
                </tr>
                <tr className="bg-transparent text-white hover:bg-violet-400/50">
                    <th scope="row" className="px-3 py-3 text-2xl text-violet-400 whitespace-nowrap">
                      <FaPeopleArrows />
                    </th>
                    <td className="px-1 py-3">
                        Black
                    </td>
                    <td className="px-1 py-3">
                        Accessories
                    </td>
                    <td className="px-1 py-3">
                        $99
                    </td>
                    <td className="px-1 py-3 text-right">
                        <a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">Edit</a>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
  )
}

export default Table;