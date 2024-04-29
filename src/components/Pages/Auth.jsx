import { useState } from "react";
import { BACKEND_URL_PREFIX } from "../../constants";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Auth = () => {
  const navigate = useNavigate();
  const [isSigninForm, setIsSigninForm] = useState(true);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatar, setAvatar] = useState("");
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignin = async () => {
    const res = await axios.post(
      `${BACKEND_URL_PREFIX}/users/login`,
      {
        username,
        password,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.data.statusCode === 200) {
      localStorage.setItem("isLoggedIn", true);
      navigate("/");
    }
  };

  const handleSignup = async () => {
    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);
    formData.append("coverImage", coverImage);

    const data = await fetch(`${BACKEND_URL_PREFIX}/users/register`, {
      method: "POST",
      body: formData,
    });
    const res = await data.json();
    if (res.statusCode === 200) {
      setIsSigninForm(true);
    }
  };

  const handleAvatarChange = (e) => {
    const avatarFile = e.target.files[0];
    if (avatarFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(avatarFile);
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(avatarFile);
      console.log(avatar);
    }
  };

  const handleCoverImageChange = (e) => {
    const coverImageFile = e.target.files[0];
    if (coverImageFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImage(coverImageFile);
        setCoverImageUrl(reader.result);
      };
      reader.readAsDataURL(coverImageFile);
      console.log(coverImage);
    }
  };

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="w-3/12 px-10 py-10 bg-black my-5 mx-auto"
    >
      <h2 className="font-bold text-white text-3xl mb-5">
        {isSigninForm ? "Login" : "Sign Up"}
      </h2>

      {!isSigninForm && (
        <div
          className="absolute py-14 w-1/12 bg-gray-900 rounded-full"
          style={{
            backgroundImage: `url(${avatarUrl})`,
            backgroundSize: "cover",
          }}
        >
          <label
            htmlFor="avatar"
            className="w-full font-semibold hover:bg-black text-white ml-5 rounded-md p-1 cursor-pointer"
          >
            + Avatar
          </label>
          <input
            className="hidden"
            type="file"
            id="avatar"
            onChange={handleAvatarChange}
          />
        </div>
      )}

      {!isSigninForm && (
        <div
          className="py-14 my-2 w-full bg-blue-300"
          style={{
            backgroundImage: `url(${coverImageUrl})`,
            backgroundSize: "cover",
          }}
        >
          <label
            htmlFor="coverImage"
            className="w-4/12 font-semibold text-white ml-52 p-1 hover:bg-black cursor-pointer rounded-md"
          >
            + Cover Image
          </label>
          <input
            className="hidden"
            type="file"
            id="coverImage"
            onChange={handleCoverImageChange}
          />
        </div>
      )}

      {!isSigninForm && (
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="full name"
          className="p-3 my-2 w-full bg-gray-900 text-white"
        />
      )}

      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="username"
        className="p-3 my-2 w-full bg-gray-900 text-white"
      />

      {!isSigninForm && (
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email address"
          className="p-3 my-2 w-full bg-gray-900 text-white"
        />
      )}

      <input
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
        className="p-3 my-2 w-full bg-gray-900 text-white"
      />
      <input
        type="checkbox"
        id="show-password"
        onClick={() => setShowPassword(!showPassword)}
      />
      <label className="text-white ml-1" htmlFor="show-password">
        {!showPassword ? "Show Password" : "Hide Password"}
      </label>
      {/* <p className="text-red-500">{errorMessage}</p> */}
      {isSigninForm && (
        <button
          className="p-3 my-6 bg-blue-700 text-white w-full"
          onClick={handleSignin}
        >
          Sign In
        </button>
      )}

      {!isSigninForm && (
        <button
          className="p-3 my-6 bg-blue-700 text-white w-full"
          onClick={handleSignup}
        >
          Sign Up
        </button>
      )}

      <div>
        <div>
          <span className="text-gray-400">
            {isSigninForm ? "New to WatchTube?" : "Already a user?"}
          </span>
          <span
            className="font-semibold text-white cursor-pointer hover:text-blue-700"
            onClick={() => setIsSigninForm(!isSigninForm)}
          >
            {isSigninForm ? "Create Account" : " Sign in now"}
          </span>
        </div>
      </div>
    </form>
  );
};

export default Auth;
