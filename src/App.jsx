import Navbar from "./components/common/Navbar";
import Sidebar from "./components/common/Sidebar";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div>
      <Navbar />
      <div className="flex">
        <Sidebar />
        <Outlet />
      </div>
    </div>
  );
}

export default App;
