import { useEffect } from "react";
import { useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import fetchChannelDetails from "../../helpers/getChannelDetails.js";
import axios from "axios";
import { BACKEND_URL_PREFIX } from "../../constants.js";
import ShimmerChannel from "./ShimmerChannel.jsx";

const Channel = () => {
  const user = useSelector((store) => store.user.loggedInUserDetails);
  const { channelId } = useParams();
  const [channel, setChannel] = useState(null);
  const highlightPlaylist = window.location.pathname.includes("playlist");
  const highlightTweet = window.location.pathname.includes("tweet");

  if (!localStorage.getItem("isLoggedIn")) {
    return "Please log in to see your channel";
  }

  useEffect(() => {
    fetchChannelDetails(channelId, setChannel);
  }, [channelId]);

  if (!channel) {
    return <ShimmerChannel />
  }

  const handleToggleSubscription = async () => {
    //to immediately show change in UI
    setChannel((prevChannel) => ({
      ...prevChannel,
      isSubscribed: !prevChannel.isSubscribed,
      subscribersCount: prevChannel.isSubscribed
        ? prevChannel.subscribersCount - 1
        : prevChannel.subscribersCount + 1,
    }));

    await axios.post(
      `${BACKEND_URL_PREFIX}/subscriptions/${channelId}`,
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  return (
    <div className="w-full mx-10">
      <div>
        <img
          className="w-full h-44"
          src={channel.coverImage}
          alt="avatar"
          loading="lazy"
        />
      </div>

      <div className="flex my-5">
        <div className="mr-5">
          <img
            className="w-44 h-44 rounded-full"
            src={channel.avatar}
            alt="avatar"
            loading="lazy"
          />
        </div>
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
          {user._id === channelId && (
            <Link
              to="/channel/edit"
              className="border-2 border-blue-700 p-2 rounded-lg w-40 hover:bg-blue-800"
            >
              Customize channel
            </Link>
          )}
          {user._id !== channelId && (
            <button
              className="bg-blue-800 p-2 rounded-lg w-24 hover:bg-blue-600"
              onClick={handleToggleSubscription}
            >
              {channel.isSubscribed ? "Subscribed" : "Subscribe"}
            </button>
          )}
        </div>
      </div>

      <div className="border-b mt-3 p-2 font-semibold text-lg">
        <Link
          className={
            "py-2 mr-5 hover:border-b-2 hover:border-white " +
            (!(highlightPlaylist || highlightTweet)
              ? "border-b-4 border-white"
              : "")
          }
          to={`/channel/${channelId}`}
        >
          Videos
        </Link>
        <Link
          className={
            "py-2 mr-5 hover:border-b-2 hover:border-white " +
            (highlightPlaylist ? "border-b-4 border-white" : "")
          }
          to={`/channel/${channelId}/playlists`}
        >
          Playlists
        </Link>
        <Link
          className={
            "py-2 mr-5 hover:border-b-2 hover:border-white " +
            (highlightTweet ? "border-b-4 border-white" : "")
          }
          to={`/channel/${channelId}/tweets`}
        >
          Tweets
        </Link>
      </div>

      <div className="mt-3">
        <Outlet />
      </div>
    </div>
  );
};

export default Channel;
