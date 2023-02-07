import { FaBuromobelexperte, FaPeopleArrows } from "react-icons/fa";
import { Link } from "react-router-dom";

const DataTable = ({ blockNumber, minerAddress, reward, dateCreated }) => {

  return (
    <>
        <tr className="text-white bg-transparent hover:bg-violet-400/50">
            <th className="w-full inline-flex items-center">
                <div className="pl-5 py-3 text-4xl text-violet-400 whitespace-nowrap">
                    <FaBuromobelexperte />
                </div>
                {dateCreated && <span className="w-full pl-3 py-3 text-xs font-medium truncate">
                    {"Block " + blockNumber}
                    <div className="text-xs font-normal truncate">
                        {/* {fetchedBlocks && fetchedBlocks[0].dateCreated.slice(0, 10)} */}
                        {dateCreated}
                    </div>
                </span>}
            </th>
            <td className="px-3 py-3 text-xs font-semibold truncate">
                FEE RECIPIENT
                <Link to="/" className="text-sm font-normal text-teal-400"> {dateCreated && minerAddress}</Link>
            </td>
            <td className="">
                <div className="mr-3 pr-3 text-right text-xs rounded-full bg-gradient-to-l from-gray-500/75">
                    {dateCreated && reward + " PRANA"}
                </div>
            </td>
        </tr>
    </>
  )
}

export default DataTable;