import { Link } from "react-router-dom";

const HashLink = ({ children, to, linkData }) => {
  
  return (
    <>
      <Link to={to} state={{ linkData: linkData }} className="text-sm font-normal text-teal-400">{children}</Link>
    </>
  )
}

export default HashLink;