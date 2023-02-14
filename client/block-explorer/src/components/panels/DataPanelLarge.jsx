import React from 'react'

const DataPanelLarge = ({ children }) => {
  return (
    <div className="w-full h-max mx-auto my-10 px-5 space-y-4 rounded-lg">
      <div className="overflow-x-auto w-full h-max rounded-lg border border-gray-700 bg-gray-900/40 shadow-md">
        {children}
      </div>
    </div>
  )
}

export default DataPanelLarge;