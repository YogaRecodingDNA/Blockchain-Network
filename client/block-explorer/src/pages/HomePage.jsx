// DISPLAY SEARCHBAR | 5 LATEST BLOCKS & LATEST PENDING TRANSACTIONS
import SearchBar from "../components/SearchBar";

const HomePage = () => {
  return (
    <div>
      <h2>The Vinyasa Blockchain Explorer</h2>
      <SearchBar />
    </div>
  )
}

export default HomePage;

/* Block Explorer functionality
-View blocks
-View confirmed transactions
-View pending transactions
-View accounts and balances
-View peers
-View network difficulty
 */