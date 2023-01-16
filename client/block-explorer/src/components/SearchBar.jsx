
const SearchBar = () => {
  return (
    <div>
      <form>
        <input placeholder='Search by Address/Txn Hash/Block #' />
        <span>
          <button>search</button>
        </span>
      </form>
    </div>
  )
}

export default SearchBar;