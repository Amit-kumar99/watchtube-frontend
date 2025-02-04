import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar } from "../../store/appSlice";
import toggleIcon from "../../../assets/toggleIcon.png";
import logo from "../../../assets/watchtubeIcon.png";
import { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_URL_PREFIX } from "../../constants";

const Navbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user.loggedInUserDetails);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [videos, setVideos] = useState([]);

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  const fetchAllVideos = async () => {
    const res = await axios.get(`${BACKEND_URL_PREFIX}/videos/getAll`);
    setVideos(res.data.data.videos);
  };

  useEffect(() => {
    fetchAllVideos();
  }, []);

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
          <div className="flex">
            <img className="w-10 h-10" src={logo} alt="watchtube-logo" />
            <span className="ml-2 text-3xl font-semibold">
              {!user || (user && user?.isPremium === false)
                ? "WatchTube"
                : "Premium"}
            </span>
          </div>
        </Link>
      </div>

      <div className="w-[40%] ml-[-33px] border border-gray-500 z-10">
        <input
          type="text"
          className="py-2 px-4 bg-black outline-none w-[100%]"
          placeholder="Search"
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setShowSuggestions(false)}
          onChange={(e) => setSearchText(e.target.value)}
        />
        {showSuggestions && (
          <div className="w-[40%] absolute mt-3 px-5 bg-black">
            {videos
              .filter((item) =>
                item.title.toLowerCase().includes(searchText.toLowerCase())
              )
              .map((item) => (
                <div className="py-1">{item.title}</div>
              ))}
          </div>
        )}
      </div>

      <div className="mr-5">
        {(user && (user.isPremium === false)) && (
          <Link
            to="/buy-premium"
            className="inline-block font-bold text-blue-700 text-base transform transition-transform duration-200 hover:scale-110"
          >
            BUY PREMIUM
          </Link>
        )}
      </div>

      <div className="mr-5">
        {user ? (
          <Link to={`/channel/${user._id}`}>
            <img
              className="w-10 h-10 rounded-full"
              src={user.avatar}
              alt="avatar"
              loading="lazy"
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
