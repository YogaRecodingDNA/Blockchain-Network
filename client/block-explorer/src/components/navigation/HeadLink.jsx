// COMPONENTS
import { Link } from 'react-router-dom';
// ASSETS/ICONS/STATUS COMPONENTS
import { TbChevronsRight } from 'react-icons/tb';

const HeadLink = ({ path, titleHead, dataHead }) => {

  return (
    <span className="w-full hover:text-violet-400">
      <Link to={path} state={{ linkData: dataHead }} className="flex hover:text-violet-400">
        {titleHead}
        <TbChevronsRight className="ml-1 text-xl" />
      </Link>
    </span>
  )
}

export default HeadLink;