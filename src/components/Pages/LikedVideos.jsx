import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL_PREFIX } from "../../constants";
import { Link } from "react-router-dom";
import convertDuration from "../../helpers/convertDuration";
import timeDifference from "../../helpers/timeDifference";

const LikedVideos = () => {
  const [likedVideos, setLikedVideos] = useState(null);
  const [likedVideosCount, setLikedVideosCount] = useState(null);

  if (!localStorage.getItem("isLoggedIn")) {
    return "Please log in to see your liked videos";
  }

  const fetchLikedVideos = async () => {
    const res = await axios.get(`${BACKEND_URL_PREFIX}/likes/allLikedVideos`, {
      withCredentials: true,
    });
    if (res.data.statusCode === 200) {
      setLikedVideos(res.data.data.likedVideos);
      setLikedVideosCount(res.data.data.likedVideosCount);
    }
  };

  useEffect(() => {
    fetchLikedVideos();
  }, []);

  if (!likedVideos) {
    return "loading...";
  }

  return (
    <div className="mb-2 mx-5 w-full">
      <div className="my-5">
        <h1 className="text-4xl mb-2">Liked Videos</h1>
        <h3 className="font-semibold text-gray-400">
          {likedVideosCount} videos
        </h3>
      </div>

      {likedVideos.map((video) => (
        <Link
          to={`/watch?v=${video.likedVideos[0]._id}`}
          key={video._id}
          className="w-full flex mb-5 hover:bg-white hover:bg-opacity-20 rounded-md py-2"
        >
          <div>
            <div className="absolute bg-black text-white py-1 px-2 rounded-md">
              {convertDuration(Math.floor(video.likedVideos[0].duration))}
            </div>
            <div className="mr-5">
              <img
                className="w-56 h-40 rounded-lg"
                src={video.likedVideos[0].thumbnail}
                alt="thumbnail"
              />
            </div>
          </div>
          <div>
            <div className="font-semibold mt-1">
              {video.likedVideos[0].title}
            </div>
            <div className="flex mt-2">
              <Link to={`/channel/${video.likedVideos[0].owner[0]._id}`} className="mr-2 font-semibold text-gray-400 hover:text-gray-300">
                {video.likedVideos[0].owner[0].username} .
              </Link>
              <div className="mr-2">{video.likedVideos[0].views} views .</div>
              <div>{timeDifference(video.likedVideos[0].createdAt)} ago</div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default LikedVideos;
