import { FaBuromobelexperte, FaPeopleArrows } from "react-icons/fa";
import HashLink from "./navigation/HashLink";

const DataTable = ({ block, transaction, dateCreated }) => {
    
    let tableBody;
    
    if (block) {
        const minerReward = block.transactions[0].value / 1000000;

        tableBody = (
            <tr className="text-white hover:bg-violet-400/50">
                <th className="w-full inline-flex items-center">
                    <div className="pl-5 py-3 text-4xl text-violet-400">
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
                    <HashLink to="/"> {block.minedBy}</HashLink>
                </td>
                <td className="">
                    <div className="mr-3 pr-3 text-right text-xs rounded-full bg-gradient-to-l from-gray-500/75">
                        {minerReward + " PRANA"}
                    </div>
                </td>
            </tr>
        )
    } else if (transaction) {
        const txnAmount = transaction.value / 1000000;
        tableBody = (
            <tr className="text-white hover:bg-violet-400/50">
                <th className="w-full inline-flex items-center">
                    <div className="pl-5 py-3 text-4xl text-violet-400">
                        <FaPeopleArrows />
                    </div>
                    <span className="w-full pl-3 py-3 text-xs font-medium truncate">
                        <HashLink to="/singleTxn" linkData={transaction.transactionDataHash}>
                            {transaction.transactionDataHash}
                        </HashLink>
                        <div className="text-xs font-normal truncate">
                            {dateCreated}
                        </div>
                    </span>
                </th>
                <td className="px-3 py-3 text-xs font-semibold truncate">
                    From:
                    <HashLink to="/userAddress" linkData={transaction.from}> 
                        {" " + transaction.from}
                    </HashLink>
                    <div>
                        To:
                        <HashLink to="/userAddress" linkData={transaction.to}> 
                            {" " + transaction.to}
                        </HashLink>
                    </div>
                </td>
                <td className="">
                    <div className="mr-3 pr-3 text-right text-xs rounded-full bg-gradient-to-l from-gray-500/75">
                        {txnAmount + " PRANA"}
                    </div>
                </td>
            </tr>
        )
    }
    
    return (
        <>
            {tableBody}
        </>
    )
}

export default DataTable;