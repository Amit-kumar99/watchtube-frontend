import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../store/appSlice";
import toggleIcon from "../../../assets/toggleIcon.png";
import logo from "../../../assets/watchtubeIcon.png";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user.loggedInUserDetails);

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  return (
    <div className="flex items-center mb-2 py-1 justify-between h-[7vh] border border-gray-500">
      <div className="flex">
        <button
          className="mx-5 py-1 px-2 hover:bg-blue-300"
          onClick={handleToggleSidebar}
        >
          <img className="w-7" src={toggleIcon} alt="toggle-img" />
        </button>
        <Link to="/">
          <img className="w-10 h-10" src={logo} alt="watchtube-logo" />
        </Link>
      </div>
      <div className="mr-5">
        {user ? (
          <Link to={`/channel/${user._id}`}>
            <img
              className="w-10 h-10 rounded-full"
              src={user.avatar}
              alt="avatar"
            />
          </Link>
        ) : (
          <Link
            className="border border-blue-400 rounded-full p-2 font-semibold hover:bg-blue-400"
            to="/auth"
          >
            Sign in
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
