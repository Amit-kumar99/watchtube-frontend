import { Link } from "react-router-dom";
import ErrorImage from "../../../assets/error-img.jpg"

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center mt-10">
      <img className="w-[30vw]" src={ErrorImage} alt="404"/>
      <div className="text-red-600 -mt-10 text-4xl">No such page exists</div>
      <Link to="/" className="font-semibold text-blue-700 mt-10 text-lg border border-blue-700 p-2 rounded-lg hover:text-white hover:bg-blue-700">Go back Home</Link>
    </div>
  );
};

export default ErrorPage;
