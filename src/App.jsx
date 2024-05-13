import { useDispatch, useSelector } from "react-redux";
import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { login } from "./store/userSlice";
import axios from "axios";
import { BACKEND_URL_PREFIX } from "./constants";

function App() {
  const dispatch = useDispatch();
  const showSidebar = useSelector((store) => store.app.showSidebar);

  const fetchUserDetails = async () => {
    return await axios.get(`${BACKEND_URL_PREFIX}/users/current-user`, {
      withCredentials: true,
    });
  };

  useEffect(() => {
    (async () => {
      if (localStorage.getItem("isLoggedIn")) {
        const res = await fetchUserDetails();
        console.log(res.data.data);
        dispatch(login(res.data.data));
      }
    })();
  }, []);

  return (
    <div className="bg-black bg-opacity-90 text-white min-h-[100vh]">
      <Navbar />
      <div className="flex">
        {showSidebar && <Sidebar />}
        <Outlet />
      </div>
    </div>
  );
}

export default App;
