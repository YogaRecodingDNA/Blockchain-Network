import { FaBuromobelexperte, FaPeopleArrows } from "react-icons/fa";
import { Link } from "react-router-dom";

const DataTable = ({ block, reward, transaction, dateCreated }) => {

    let content;

    if (block) {
        content = (
            <tr className="text-white bg-transparent hover:bg-violet-400/50">
                <th className="w-full inline-flex items-center">
                    <div className="pl-5 py-3 text-4xl text-violet-400 whitespace-nowrap">
                        <FaBuromobelexperte />
                    </div>
                    <span className="w-full pl-3 py-3 text-xs font-medium truncate">
                        {"Block " + block.index}
                        <div className="text-xs font-normal truncate">
                            {dateCreated}
                        </div>
                    </span>
                </th>
                <td className="px-3 py-3 text-xs font-semibold truncate">
                    Fee Recipient
                    <Link to="/" className="text-sm font-normal text-teal-400"> {dateCreated && block.minedBy}</Link>
                </td>
                <td className="">
                    <div className="mr-3 pr-3 text-right text-xs rounded-full bg-gradient-to-l from-gray-500/75">
                        {reward + " PRANA"}
                    </div>
                </td>
            </tr>
        )
    } else if (transaction) {
        content = (
            <tr className="text-white bg-transparent hover:bg-violet-400/50">
                <th className="w-full inline-flex items-center">
                    <div className="pl-5 py-3 text-4xl text-violet-400 whitespace-nowrap">
                        <FaPeopleArrows />
                    </div>
                    <span className="w-full pl-3 py-3 text-xs font-medium truncate">
                        <Link to="/" className="text-sm font-normal text-teal-400">{transaction.transactionDataHash}</Link>
                        <div className="text-xs font-normal truncate">
                            {dateCreated}
                        </div>
                    </span>
                </th>
                <td className="px-3 py-3 text-xs font-semibold truncate">
                    From
                    <Link to="/" className="text-sm font-normal text-teal-400"> {transaction.from}</Link>
                    <div>
                        To
                        <Link to="/" className="text-sm font-normal text-teal-400"> {transaction.to}</Link>
                    </div>
                </td>
                <td className="">
                    <div className="mr-3 pr-3 text-right text-xs rounded-full bg-gradient-to-l from-gray-500/75">
                        {(transaction.value / 1000000) + " PRANA"}
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