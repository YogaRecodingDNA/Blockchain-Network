import React from 'react'

const PageHead = ({ children }) => {
  return (
    <div className="flex h-10 mx-5 my-5 justify-start items-center">
      <h1 className="mx-5 mt-px text-xl text-gray-300 font-semibold">
      {children}
      </h1>
    </div>
  )
}

export default PageHead;