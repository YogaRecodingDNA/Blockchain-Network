import { MdOutlineWarning } from "react-icons/md";

const StatusFail = () => {
  return (
    <div className="flex text-rose-600">
      <MdOutlineWarning className="text-lg" />
      Fail
    </div>
  )
}

export default StatusFail;