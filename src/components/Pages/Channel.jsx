import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { Link, Outlet, useParams } from "react-router-dom";
import { BACKEND_URL_PREFIX } from "../../constants";

const Channel = () => {
  const { channelId } = useParams();
  const [channel, setChannel] = useState(null);

  const fetchChannelDetails = async () => {
    const res = await axios.get(
      `${BACKEND_URL_PREFIX}/users/channel/${channelId}`,
      {
        withCredentials: true,
      }
    );
    if (res.data.statusCode === 200) {
      setChannel(res.data.data);
    }
  };

  useEffect(() => {
    fetchChannelDetails();
  }, []);

  if (!channel) {
    return "loading...";
  }

  return (
    <div className="w-full">
      <div>
        <img className="w-full h-44" src={channel.coverImage} alt="avatar" />
      </div>

      <div className="flex border mt-2">
        <div className="mr-5">
          <img
            className="w-44 h-44 rounded-full"
            src={channel.avatar}
            alt="avatar"
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
          <div className="bg-gray-300 p-2 rounded-lg w-40">
            Customize channel
          </div>
        </div>
      </div>

      <div className="border mt-3 p-2 font-semibold text-lg">
        <Link
          className="py-2 mr-5 hover:border-b-2 hover:border-black"
          to={`/channel/${channelId}`}
        >
          Videos
        </Link>
        <Link
          className="py-2 mr-5 hover:border-b-2 hover:border-black"
          to={`/channel/${channelId}/playlists`}
        >
          Playlists
        </Link>
        <Link
          className="py-2 mr-5 hover:border-b-2 hover:border-black"
          to={`/channel/${channelId}/tweets`}
        >
          Tweets
        </Link>
      </div>

      <div className="border mt-3">
        <Outlet/>
      </div>
    </div>
  );
};

export default Channel;
