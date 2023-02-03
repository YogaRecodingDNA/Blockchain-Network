import axios from 'axios';
import { useState, useEffect } from 'react';

const baseUrl = 'http://localhost:5555';

const ConfirmedTxns = () => {
  const [confirmedTxs, setConfirmedTxs] = useState([]);

  useEffect(() => {
    axios.get(baseUrl + "/transactions/confirmed")
    .then((list) => {
      setConfirmedTxs(list.data);
    })
    .catch(error => console.error(error));
  }, []);

  console.log(confirmedTxs);

  const renderedTxs = confirmedTxs.map( (transaction, index) => {
    return (
      <tr key={index}>
        <td>
          <a href="./" style={{color: 'blue'}}>
            {transaction.transactionDataHash.slice(0, 11) + "..."}
          </a>
        </td>
        <td>
          <a href="./" style={{color: 'blue'}}>
            {transaction.from.slice(0, 11) + "..."}
          </a>
        </td>
        <td>
          <a href="./" style={{color: 'blue'}}>
            {transaction.to.slice(0, 11) + "..."}
          </a>
        </td>
        <td>
          {transaction.dateCreated}
        </td>
      </tr>
    )
  })
  return (
    <div> CONFIRMED TRANSACTIONS ======================================
      <table>
        <thead>
          <tr>
            <th>Transaction Hash | </th>
            <th>From Address | </th>
            <th>To Address | </th>
            <th>Transaction Date</th>
          </tr>
        </thead>
        <tbody>
          {renderedTxs}
        </tbody>
      </table>
    </div>
  )
}

export default ConfirmedTxns;