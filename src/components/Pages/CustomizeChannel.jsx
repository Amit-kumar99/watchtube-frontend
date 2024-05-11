import React, { useEffect, useState } from "react";
import fetchChannelDetails from "../../helpers/getChannelDetails";
import { Link, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaCloudUploadAlt } from "react-icons/fa";
import { BACKEND_URL_PREFIX } from "../../constants";
import axios from "axios";

const CustomizeChannel = () => {
  if (!localStorage.getItem("isLoggedIn")) {
    return "You are unauthorized to edit this channel";
  }
  const user = useSelector((store) => store.user.loggedInUserDetails);
  const [channelId, setChannelId] = useState(null);
  const [channel, setChannel] = useState(null);
  const [coverImageUrl, setCoverImageUrl] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [showUploadCoverImagePopup, setShowUploadCoverImagePopup] =
    useState(false);
  const [showUploadAvatarPopup, setShowUploadAvatarPopup] = useState(false);
  const location = useLocation();
  const [highlightPersonalDetails, setHighlightPersonalDetails] =
    useState(false);
  const [highlightChangePassword, setHighlightChangePassword] = useState(false);

  const checkURL = () => {
    const pathname = location.pathname;
    setHighlightPersonalDetails(pathname.includes("personalDetails"));
    setHighlightChangePassword(pathname.includes("changePassword"));
  };

  useEffect(() => {
    checkURL();
  }, [location.pathname]);

  useEffect(() => {
    if (user) {
      setChannelId(user._id);
    }
  }, [user]);

  useEffect(() => {
    if (channelId) {
      fetchChannelDetails(channelId, setChannel);
    }
  }, [channelId]);

  if (!channel) {
    return "loading...";
  }

  const handleCoverImageChange = (e) => {
    const coverImage = e.target?.files[0];
    if (coverImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImageFile(coverImage);
        setCoverImageUrl(reader.result);
      };
      reader.readAsDataURL(coverImage);
    }
  };

  const updateCoverImageApi = async () => {
    //immediate UI update
    setChannel((prevChannel) => ({
      ...prevChannel,
      coverImage: coverImageUrl,
    }));
    setShowUploadCoverImagePopup(false);

    const formData = new FormData();
    formData.append("coverImage", coverImageFile);
    const res = await axios.patch(
      `${BACKEND_URL_PREFIX}/users/update-coverImage`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    if (res.data.statusCode === 200) {
      alert("coverImage updated successfully");
    }
  };

  const handleAvatarChange = (e) => {
    const avatar = e.target.files[0];
    if (avatar) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarFile(avatar);
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(avatar);
    }
  };

  const updateAvatarApi = async () => {
    //immediate UI update
    setChannel((prevChannel) => ({
      ...prevChannel,
      avatar: avatarUrl,
    }));
    setShowUploadAvatarPopup(false);

    const formData = new FormData();
    formData.append("avatar", avatarFile);
    const res = await axios.patch(
      `${BACKEND_URL_PREFIX}/users/update-avatar`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    if (res.data.statusCode === 200) {
      alert("avatar updated successfully");
    }
  };

  return (
    <div className="w-full">
      <div
        className="absolute mt-5 ml-10 cursor-pointer bg-gray-500 p-1 rounded-md"
        onClick={() => setShowUploadCoverImagePopup(true)}
      >
        <FaCloudUploadAlt />
      </div>
      <div
        className="py-14 h-44 my-2 w-full bg-blue-300"
        style={{
          backgroundImage: `url(${channel.coverImage})`,
          backgroundSize: "100% 100%",
        }}
      ></div>

      {/* upload cover Image popup */}
      {showUploadCoverImagePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded shadow-lg w-3/12 flex flex-col">
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={() => {
                setShowUploadCoverImagePopup(false);
                // setCoverImageFile(null);
              }}
            >
              Close
            </button>
            <div
              className="py-14 my-2 w-full bg-blue-300"
              style={{
                backgroundImage: `url(${
                  coverImageUrl ? coverImageUrl : channel.coverImage
                })`,
                backgroundSize: "100% 100%",
              }}
            >
              <label
                htmlFor="coverImage"
                className="w-full h-44 font-semibold text-blue-700 text-xl ml-52 p-1 hover:bg-white cursor-pointer rounded-md"
              >
                + Cover Image
              </label>
              <input
                className="hidden"
                type="file"
                id="coverImage"
                accept="image/*"
                onChange={handleCoverImageChange}
              />
            </div>
            <button
              className="bg-lime-700 hover:bg-lime-500 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={updateCoverImageApi}
            >
              Upload
            </button>
          </div>
        </div>
      )}

      <div className="flex border mt-2">
        <div
          className="absolute mt-5 ml-10 cursor-pointer bg-gray-500 p-1 rounded-md"
          onClick={() => setShowUploadAvatarPopup(true)}
        >
          <FaCloudUploadAlt />
        </div>
        <div
          className="w-44 h-44 rounded-full bg-blue-300 mr-5"
          style={{
            backgroundImage: `url(${channel.avatar})`,
            backgroundSize: "100% 100%",
          }}
        ></div>

        {/* Upload avatar popup */}
        {showUploadAvatarPopup && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded shadow-lg w-3/12 flex flex-col">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={() => {
                  setShowUploadAvatarPopup(false);
                  // setAvatarFile(null);
                }}
              >
                Close
              </button>
              <div
                className="py-14 my-2 w-full bg-blue-300"
                style={{
                  backgroundImage: `url(${
                    avatarUrl ? avatarUrl : channel.avatar
                  })`,
                  backgroundSize: "100% 100%",
                }}
              >
                <label
                  htmlFor="avatar"
                  className="w-full h-44 font-semibold text-blue-700 text-xl ml-52 p-1 hover:bg-white cursor-pointer rounded-md"
                >
                  + Avatar
                </label>
                <input
                  className="hidden"
                  type="file"
                  id="avatar"
                  accept="image/*"
                  onChange={handleAvatarChange}
                />
              </div>
              <button
                className="bg-lime-700 hover:bg-lime-500 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={updateAvatarApi}
              >
                Upload
              </button>
            </div>
          </div>
        )}

        <div className="flex flex-col justify-between py-2">
          <div className="text-3xl font-bold">{channel.fullName}</div>
          <div>
            <span>{channel.username} . </span>
            <span>{channel.videosCount} videos</span>
          </div>
          <div>
            <span>{channel.subscribersCount} subscribers . </span>
            <span>{channel.subscribedToCount} subscriptions</span>
          </div>
          <Link
            className="bg-blue-700 text-white p-2 rounded-lg w-8/12 pl-5 hover:bg-blue-500"
            to={`/channel/${channelId}`}
          >
            View Channel
          </Link>
        </div>
      </div>

      <div className="border mt-3 p-2 font-semibold text-lg mx-auto">
        <Link
          className={
            "py-2 mr-5 hover:border-b-2 hover:border-white " +
            (highlightPersonalDetails ? "border-b-2 border-white" : "")
          }
          to="personalDetails"
        >
          Edit Personal Details
        </Link>
        <Link
          className={
            "py-2 mr-5 hover:border-b-2 hover:border-white " +
            (highlightChangePassword ? "border-b-2 border-white" : "")
          }
          to="changePassword"
        >
          Change Password
        </Link>
      </div>

      <Outlet />
    </div>
  );
};

export default CustomizeChannel;
