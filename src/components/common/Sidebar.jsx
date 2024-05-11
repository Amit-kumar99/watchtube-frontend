import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { GoHome } from "react-icons/go";
import { MdFileUpload } from "react-icons/md";
import { FaHistory } from "react-icons/fa";
import { FaUsers } from "react-icons/fa6";
import { SlLike } from "react-icons/sl";
import { FaRegUser } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import useLogout from "../../customHooks/useLogout";

const Sidebar = () => {
  const user = useSelector((store) => store.user.loggedInUserDetails);
  const logout = useLogout();

  const handleLogout = async () => {
    await logout();
  }

  return (
    <div className="w-[20vw] h-[90vh] border p-2 mx-5 font-semibold">
      <Link to="/">
        <div className="hover:bg-white hover:bg-opacity-20 flex items-center pl-3 py-3">
          <GoHome />
          <span className="pl-5">Home</span>
        </div>
      </Link>
      <Link to="/content">
        <div className="hover:bg-white hover:bg-opacity-20 flex items-center pl-3 py-3">
          <MdFileUpload />
          <span className="pl-5">Upload Content</span>
        </div>
      </Link>
      <Link to="/history">
        <div className="hover:bg-white hover:bg-opacity-20 flex items-center pl-3 py-3">
          <FaHistory />
          <span className="pl-5">History</span>
        </div>
      </Link>
      <Link to="/subscribers">
        <div className="hover:bg-white hover:bg-opacity-20 flex items-center pl-3 py-3">
          <FaUsers />
          <span className="pl-5">Subscribers</span>
        </div>
      </Link>
      <Link to="/subscriptions">
        <div className="hover:bg-white hover:bg-opacity-20 flex items-center pl-3 py-3">
          <FaUsers />
          <span className="pl-5">Subscriptions</span>
        </div>
      </Link>
      <Link to="/likedVideos">
        <div className="hover:bg-white hover:bg-opacity-20 flex items-center pl-3 py-3">
          <SlLike />
          <span className="pl-5">Liked Videos</span>
        </div>
      </Link>
      {user && (
        <Link to={`/channel/${user._id}`}>
          <div className="hover:bg-white hover:bg-opacity-20 flex items-center pl-3 py-3">
            <FaRegUser />
            <span className="pl-5">My Channel</span>
          </div>
        </Link>
      )}
      {localStorage.getItem("isLoggedIn") && (<button className="w-full" onClick={handleLogout}>
        <div className="hover:bg-white hover:bg-opacity-20 flex items-center w-full pl-3 py-3">
          <BiLogOut />
          <span className="pl-5">Logout</span>
        </div>
      </button>)}
    </div>
  );
};

export default Sidebar;
