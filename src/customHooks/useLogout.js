import axios from "axios";
import { BACKEND_URL_PREFIX } from "../constants";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/userSlice";

const useLogout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        `${BACKEND_URL_PREFIX}/users/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      if (res.data.statusCode === 200) {
        localStorage.removeItem("isLoggedIn");
        dispatch(logout());
        navigate("/auth");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return handleLogout;
};

export default useLogout;
