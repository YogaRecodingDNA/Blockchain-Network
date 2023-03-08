const HeadPanelHalf = ({ title, data }) => {
  return (
    <div className="flex-1 w-1/2 h-24 justify-start items-start rounded-lg border border-gray-700 bg-gray-900/50">
      <div className="flex space-x-1/3 mx-6 mt-2 text-sm text-gray-500 font-medium">
        <p>{title}</p>
      </div>
      <div className="mx-6 mt-px text-xl font-normal">
        <h1>{data}</h1>
      </div>
    </div>
  )
}

export default HeadPanelHalf;