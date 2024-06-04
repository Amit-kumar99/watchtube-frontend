import { useState } from "react";
import useLogout from "../../customHooks/useLogout";
import axios from "axios";
import { BACKEND_URL_PREFIX } from "../../constants";
import { toast } from "react-toastify";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState(null);
  const logout = useLogout();

  const handleChangePassword = async () => {
    if (!oldPassword?.trim() || !newPassword?.trim()) {
      setError("all fields required");
      return ;
    }
    const res = await axios.patch(
      `${BACKEND_URL_PREFIX}/users/change-password`,
      {
        oldPassword,
        newPassword,
      },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    if (res.data.statusCode === 200) {
      toast("Password updated successfully");
      //logout user
      logout();
    }
  }

  return (
    <form
      className="border mt-5 w-3/12 mx-auto p-5"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="mb-5">
        <input
          className="p-2 w-full bg-black"
          type="password"
          id="oldPassword"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="Old password"
        />
      </div>
      <div className="mb-5">
        <input
          className="p-2 w-full bg-black"
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
        />
      </div>
      <div className="text-red-500 -mt-3">{error}</div>
      <div className="w-full flex pt-3">
        <button className="py-2 bg-blue-700 text-white mx-auto w-7/12 font-semibold text-lg"
        onClick={handleChangePassword}>
          Change Password
        </button>
      </div>
    </form>
  );
};

export default ChangePassword;
