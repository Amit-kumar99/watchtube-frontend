import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL_PREFIX } from "../../constants";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const Videos = () => {
  const user = useSelector((store) => store.user.loggedInUserDetails);
  const { channelId } = useParams();
  const [videos, setVideos] = useState(null);

  const fetchUserVideos = async () => {
    const res = await axios.get(
      `${BACKEND_URL_PREFIX}/videos/profile/${channelId}`,
      {
        withCredentials: true,
      }
    );
    console.log(res.data.data);
    if (res.data.statusCode === 200) {
      setVideos(res.data.data.videos);
    }
  };

  useEffect(() => {
    fetchUserVideos();
  }, []);

  const handleEditVideo = () => {};

  const handleDeleteVideo = () => {};

  if (!videos) {
    return "loading...";
  }

  if (videos.length === 0) {
    return "No videos available";
  }

  return (
    <div className="flex flex-wrap mb-3">
      {videos.map((video) => (
        <Link
          to={`/watch?v=${video._id}`}
          key={video._id}
          className="border w-3/12"
        >
          <div className="absolute bg-black text-white py-1 px-2 rounded-md">
            {video.duration.toFixed(2)}
          </div>
          <div>
            <img
              className="w-full h-64"
              src={video.thumbnail}
              alt="thumbnail"
            />
          </div>
          <div className="font-semibold mt-1">{video.title}</div>
          <div className="flex">
            <div className="mr-2">{video.views} views .</div>
            <div>{video.createdAt} ago</div>
          </div>
          {(user._id === channelId) && (<div className="flex justify-between mt-2">
            <button className="bg-lime-700 text-white font-semibold py-2 px-4" onClick={handleEditVideo}>
              Edit video
            </button>
            <button className="bg-red-700 text-white font-semibold py-2 px-4" onClick={handleDeleteVideo}>
              Delete video
            </button>
          </div>)}
        </Link>
      ))}
    </div>
  );
};

export default Videos;
