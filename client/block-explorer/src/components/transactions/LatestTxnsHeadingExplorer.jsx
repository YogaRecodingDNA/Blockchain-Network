import Button from "../Button";

const LatestTxnsHeadingExplorer = ({ isConfirmedTxns, onToggleTxns }) => {
  return (
    <div className="relative sticky flex w-full pl-6 pt-2 h-16 top-0 font-semibold bg-gradient-to-b from-cyan-900 via-cyan-900">
      Latest {isConfirmedTxns ? "Confirmed" : "Pending"} Txns
      <span className="absolute right-0 my-2 mx-3">
        <Button secondary className="relative px-4 rounded-full" onClick={onToggleTxns}>
        View {isConfirmedTxns ? "Pending" : "Confirmed"}
        </Button>
      </span>
    </div>
  )
}

export default LatestTxnsHeadingExplorer;