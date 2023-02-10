import { Link } from "react-router-dom";

const HashLink = ({ children, to }) => {
  return (
    <>
      <Link to={to} className="text-sm font-normal text-teal-400" >{children}</Link>
    </>
  )
}

export default HashLink;