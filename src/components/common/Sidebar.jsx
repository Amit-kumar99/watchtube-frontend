import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  const links = [
    { to: "/", icon: <GoHome />, text: "Home" },
    { to: "/content", icon: <MdFileUpload />, text: "Upload Content" },
    { to: "/history", icon: <FaHistory />, text: "History" },
    { to: "/subscribers", icon: <FaUsers />, text: "Subscribers" },
    { to: "/subscriptions", icon: <FaUsers />, text: "Subscriptions" },
    { to: "/likedVideos", icon: <SlLike />, text: "Liked Videos" },
  ];

  return (
    <div className="w-[20vw] h-[90vh] border border-gray-500 mr-5 font-semibold">
      {links.map((link, index) => (
        <Link
          key={index}
          to={link.to}
          className={`hover:bg-white hover:bg-opacity-20 flex items-center pl-3 py-3 ${
            (link.to === "/" && location.pathname === "/") ||
            (location.pathname.includes(link.to) && link.to !== "/")
              ? "bg-white bg-opacity-20"
              : ""
          }`}
        >
          {link.icon}
          <span className="pl-5">{link.text}</span>
        </Link>
      ))}
      {user && (
        <Link
          to={`/channel/${user._id}`}
          className="hover:bg-white hover:bg-opacity-20 flex items-center pl-3 py-3"
        >
          <FaRegUser />
          <span className="pl-5">My Channel</span>
        </Link>
      )}
      {localStorage.getItem("isLoggedIn") && (
        <button
          onClick={handleLogout}
          className="w-full hover:bg-white hover:bg-opacity-20 flex items-center pl-3 py-3"
        >
          <BiLogOut />
          <span className="pl-5">Logout</span>
        </button>
      )}
    </div>
  );
};

export default Sidebar;
