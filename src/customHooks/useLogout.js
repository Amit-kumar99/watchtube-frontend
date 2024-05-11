import axios from "axios";
import { BACKEND_URL_PREFIX } from "../constants";
import { useNavigate } from "react-router-dom";

const useLogout = () => {
  const navigate = useNavigate();

  const logout = async () => {
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
        localStorage.setItem(null);
        navigate("/auth");
        window.location.reload();
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return logout;
};

export default useLogout;
