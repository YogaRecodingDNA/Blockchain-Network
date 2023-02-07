import { FaBuromobelexperte, FaPeopleArrows } from "react-icons/fa";
import { Link } from "react-router-dom";

const DataTable = ({ blockNumber, minerAddress, reward, txHash, to, from, amount, dateCreated }) => {

    let content;

    if (blockNumber) {
        content = (
            <tr className="text-white bg-transparent hover:bg-violet-400/50">
                <th className="w-full inline-flex items-center">
                    <div className="pl-5 py-3 text-4xl text-violet-400 whitespace-nowrap">
                        <FaBuromobelexperte />
                    </div>
                    <span className="w-full pl-3 py-3 text-xs font-medium truncate">
                        {"Block " + blockNumber}
                        <div className="text-xs font-normal truncate">
                            {dateCreated}
                        </div>
                    </span>
                </th>
                <td className="px-3 py-3 text-xs font-semibold truncate">
                    Fee Recipient
                    <Link to="/" className="text-sm font-normal text-teal-400"> {dateCreated && minerAddress}</Link>
                </td>
                <td className="">
                    <div className="mr-3 pr-3 text-right text-xs rounded-full bg-gradient-to-l from-gray-500/75">
                        {reward + " PRANA"}
                    </div>
                </td>
            </tr>
        )
    } else if (txHash) {
        content = (
            <tr className="text-white bg-transparent hover:bg-violet-400/50">
                <th className="w-full inline-flex items-center">
                    <div className="pl-5 py-3 text-4xl text-violet-400 whitespace-nowrap">
                        <FaPeopleArrows />
                    </div>
                    <span className="w-full pl-3 py-3 text-xs font-medium truncate">
                        <Link to="/" className="text-sm font-normal text-teal-400">{txHash}</Link>
                        <div className="text-xs font-normal truncate">
                            {dateCreated}
                        </div>
                    </span>
                </th>
                <td className="px-3 py-3 text-xs font-semibold truncate">
                    From
                    <Link to="/" className="text-sm font-normal text-teal-400"> {from}</Link>
                    <div>
                        To
                        <Link to="/" className="text-sm font-normal text-teal-400"> {to}</Link>
                    </div>
                </td>
                <td className="">
                    <div className="mr-3 pr-3 text-right text-xs rounded-full bg-gradient-to-l from-gray-500/75">
                        {amount + " PRANA"}
                    </div>
                </td>
            </tr>
        )
    }
    
    return (
        <>
            {content}
        </>
    )
}

export default DataTable;