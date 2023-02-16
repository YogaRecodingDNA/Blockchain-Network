const TableFooter = ({ numberOfCells }) => {

  const tableFoot = (length) => {
    let footArray = [];
    for (let i = 0; i < length; i++){
      footArray.push(
        <td key={i} className="h-10 w-full bg-gradient-to-b from-transparent via-cyan-900 to-cyan-900"></td>
      )
    }

    return footArray;
  }

  return (
    <>
      {tableFoot(numberOfCells)}
    </>
  )
}

export default TableFooter;