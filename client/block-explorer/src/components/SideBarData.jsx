// import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as GiIcons from "react-icons/gi";
import * as SiIcons from "react-icons/si";

const SideBarData = [
  {
    title: "Home",
    path: "/",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text"
  },
  {
    title: "Blocks",
    path: "/blocks",
    icon: <SiIcons.SiHiveBlockchain />,
    cName: "nav-text"
  },
  {
    title: "Transactions",
    path: "/transactions",
    icon: <GiIcons.GiCoinflip />,
    cName: "nav-text"
  },
  
];

export default SideBarData;