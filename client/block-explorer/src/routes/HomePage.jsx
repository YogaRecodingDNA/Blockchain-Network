import { useNavigate } from "react-router-dom";
import shootingStar from "../assets/images/shootingStar.jpg";
import Button from "../components/Button";

const HomePage = () => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate("explorer");
  }

  return (
    <div className="bg-cover bg-fixed w-full h-full" style={{ backgroundImage: `url(${shootingStar})`}}>
      <div className="flex bg-gradient-to-b from-gray-900 via-transparent justify-center items-start w-full h-full text-white">
        <div className="font-medium mt-20">
          <h1 className="font-medium text-center text-3xl">
            V I N Y A S A ~ C H A I N
            <div className="pt-4">
              <p className="text-lg">Welcome to the Vinyasa Blockchain.<br/>
              A network designed to provide decentralized<br/>
              opportunities for conscious awakening.
              </p>
            </div>
          </h1>
          <div className="mt-5">
            <Button className="mx-auto" primary onClick={handleClick}>Explore Freely</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage;