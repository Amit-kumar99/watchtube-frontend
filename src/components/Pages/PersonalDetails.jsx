import { useState } from "react";
import { useSelector } from "react-redux";
import { BACKEND_URL_PREFIX } from "../../constants";
import axios from "axios";

const PersonalDetails = () => {
  const user = useSelector((store) => store.user.loggedInUserDetails);
  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);

  const handleUpdatePersonalDetails = async () => {
    if (!fullName?.trim() || !email?.trim()) {
      alert("all fields required");
      return;
    }

    const res = await axios.patch(
      `${BACKEND_URL_PREFIX}/users/update-account`,
      {
        fullName,
        email,
      },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );

    if (res.data.statusCode === 200) {
      alert("Personal Info Updated successfully");
    }
  };

  return (
    <form
      className="border mt-5 w-3/12 mx-auto p-5"
      onSubmit={(e) => e.preventDefault()}
    >
      <div className="mb-5">
        <input
          className="p-2 w-full bg-black"
          type="text"
          id="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="fullName"
        />
      </div>
      <div className="mb-5">
        <input
          className="p-2 w-full bg-black"
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email"
        />
      </div>
      <div className="w-full flex">
        <button
          className="p-2 bg-blue-700 text-white mx-auto w-4/12 font-semibold text-lg"
          onClick={handleUpdatePersonalDetails}
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default PersonalDetails;
