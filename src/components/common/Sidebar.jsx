import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Sidebar = () => {
  const user = useSelector((store) => store.user.loggedInUserDetails);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
  }
  
  return (
    <div className="w-[20vw] h-[90vh] border p-2 mx-5 font-semibold">
      <Link to="/">
        <div className="hover:bg-gray-100">Home</div>
      </Link>
      <Link to="/history">
        <div className="hover:bg-gray-100">History</div>
      </Link>
      <Link to="/subscribers">
        <div className="hover:bg-gray-100">Subscribers</div>
      </Link>
      <Link to="/subscriptions">
        <div className="hover:bg-gray-100">Subscriptions</div>
      </Link>
      <Link to="/likedVideos">
        <div className="hover:bg-gray-100">Liked Videos</div>
      </Link>
      {user && (<Link to={`/channel/${user._id}`}>
        <div className="hover:bg-gray-100">My Channel</div>
      </Link>)}
      <button onClick={handleLogout}>
        <div className="hover:bg-gray-100">Logout</div>
      </button>
    </div>
  );
};

export default Sidebar;
