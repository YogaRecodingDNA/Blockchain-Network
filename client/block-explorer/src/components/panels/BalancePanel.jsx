const BalancePanel = ({ safe, confirmed, pending }) => {
  return (
    <div className="flex w-1/2 h-24 justify-start items-center rounded-lg border border-gray-700 bg-gray-900/50">
      <div className="w-auto space-y-2">
        <div className="flex items-center mx-6 text-sm text-gray-500 font-medium">
          <p>SAFE BALANCE <span className="text-xs text-emerald-500">(6+ confirmations)</span></p>
        </div>
        <div className="flex items-center mx-6 text-sm text-gray-500 font-medium">
          <p>CONFIRMED BALANCE <span className="text-xs text-sky-500">(1+ confirmations)</span></p>
        </div>
        <div className="flex items-center mx-6 text-sm text-gray-500 font-medium">
          <p>PENDING BALANCE <span className="text-xs text-rose-500">(0 confirmations)</span></p>
        </div>
      </div>
      <div className="w-auto">
        <div className="text-sm text-gray-500 font-medium">
          <p className="text-white text-xl font-normal">{safe}</p>
        </div>
        <div className="text-sm text-gray-500 font-medium">
          <p className="text-gray-400 text-xl font-normal">{confirmed}</p>
        </div>
        <div className="flex items-center text-sm text-gray-500 font-medium">
          <p className="text-gray-500 text-xl font-normal">{pending}</p>
          <span className="ml-2 text-xs text-amber-400">(expected balance)</span>
        </div>
      </div>
    </div>
  )
}

export default BalancePanel;