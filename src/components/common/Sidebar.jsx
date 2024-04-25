import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-[20vw] border p-2 mx-5 font-semibold">
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
    </div>
  );
};

export default Sidebar;
