// HOOKS
import { useLocation } from "react-router-dom";
import { useFetchTransactionByHashQuery } from "../store";
import useGetTime from "../hooks/use-getTime";
// COMPONENTS
import SearchBar from "../components/navigation/SearchBar";
import DataPanelLarge from "../components/panels/DataPanelLarge";
import HashLink from "../components/navigation/HashLink";
import StatusSuccess from "../components/status-indicators/StatusSuccess";
import StatusPending from "../components/status-indicators/StatusPending";
// ASSETS
import moonExplorer from "../assets/images/moonExplorer.jpeg"
import { Dna } from 'react-loader-spinner';

const SingleTransactionPage = () => {
  const location = useLocation();
  const { linkData } = location.state;
  const { getElapsed } = useGetTime();

  const {data, error, isFetching} = useFetchTransactionByHashQuery(linkData);

  console.log("TXN HASH ", linkData);
  console.log("TXN BY HASH ======== DATA", data);

  const handleSubmit = () => {
    return;
  }

  let tableData;

  if (isFetching) {
    tableData = (
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
    tableData = <div>Error loading blocks.</div>

  } else {
    const date = Date.now();
    const dateCreated = +new Date(data && data.dateCreated);
    const timeElapsed = getElapsed(date, dateCreated);

    const transactionData = [
      {rowHead: "Transaction Hash", rowData: data.transactionDataHash},
      {
        rowHead: "Status",
        rowData: data.transferSuccessful || data.data === "coinbase tx" ?
        <StatusSuccess /> :
        <StatusPending />
      },
      {
        rowHead: "Block",
        rowData:
        <HashLink to="/singleBlock" linkData={data.minedInBlockIndex}>
          {data.minedInBlockIndex}
        </HashLink> || "~"
      },
      {rowHead: "Timestamp", rowData: timeElapsed},
      {rowHead: "From", rowData: <HashLink to="/">{data.from}</HashLink>},
      {rowHead: "To", rowData: <HashLink to="/">{data.to}</HashLink>},
      {rowHead: "Value", rowData: `${data.value / 1000000} PRANA`},
      {rowHead: "Transaction Fee", rowData: `${data.fee} Nyasa`},
    ];

    tableData = transactionData.map( (item, index) => {

      return (
        <tr key={index} className="text-left text-white hover:bg-violet-400/50">
          <th className="pl-4 pr-10 py-4">
            {item.rowHead}:
          </th>
          <td className="px-4 py-4">
            {item && item.rowData}
          </td>
        </tr>
      );
    });
  }

  return (
    <div className="flex overflow-auto bg-cover bg-fixed w-full h-full" style={{ backgroundImage: `url(${moonExplorer})`}}>
      <div className="w-full h-full bg-gradient-to-b from-gray-900 via-transparent text-white">
        <div>
          <div className="flex items-start w-10/12 ml-auto">
            <SearchBar onSubmit={handleSubmit} />
          </div>
        </div>
        <DataPanelLarge>
          <table className="border table-auto w-full text-center text-xs text-white">
            <thead className='px-6 py-5 h-14 text-lg text-left font-normal text-gray-300 bg-gradient-to-b from-cyan-900 via-cyan-900'>
              <tr>
                <td className="w-48 pl-4">Transaction Details</td>
                <td></td>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-700">
                {tableData}
            </tbody>
            <tfoot className="h-10 w-full bg-gradient-to-b from-transparent via-cyan-900 to-cyan-900">
                <tr>
                  <td></td>
                  <td></td>
                </tr>
            </tfoot>
          </table>
        </DataPanelLarge>
      </div>
    </div>
  );
}

export default SingleTransactionPage