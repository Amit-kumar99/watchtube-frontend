import { Link } from "react-router-dom";
import { WATCHTUBE_LOGO_URL } from "../../constants";

const Navbar = () => {
  return (
    <div className="flex mt-2 justify-between h-[5vh] border">
      <div className="flex">
        <button>
          <img src="" alt="toggle-img"/>
        </button>
        <img className="w-24 h-7" src={WATCHTUBE_LOGO_URL} alt="watchtube-logo" />
      </div>
      <div className="mr-5">
        {/* <img src="" alt="user-img"/> */}
        <Link className="border rounded-full p-2 font-semibold hover:bg-blue-100" to="/auth">Sign in</Link>
      </div>
    </div>
  );
};

export default Navbar;
