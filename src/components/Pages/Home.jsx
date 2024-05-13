import { useState, useEffect } from "react";
import { BACKEND_URL_PREFIX } from "../../constants";
import { Link } from "react-router-dom";
import timeDifference from "../../helpers/timeDifference";
import convertDuration from "../../helpers/convertDuration";
import convertViews from "../../helpers/convertViews";
import axios from "axios";

const Home = () => {
  const [videos, setVideos] = useState([]);

  const fetchVideos = async () => {
    const res = await axios.get(`${BACKEND_URL_PREFIX}/videos/getAll`);
    setVideos(res.data.data.videos);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div className="w-full ml-10">
      <div className="flex flex-wrap w-full">
        {videos.length !== 0 &&
          videos.map((video) => (
            <Link
              to={`/watch?v=${video._id}`}
              key={video._id}
              className="w-[31%] mr-5 mb-5"
            >
              <div className="absolute bg-black text-white p-1">
                {convertDuration(Math.floor(video.duration))}
              </div>
              <div className="w-full">
                <img
                  className="w-full h-56"
                  src={video.thumbnail}
                  alt="vid-thumbnail"
                />
              </div>
              <div className="flex mt-2">
                <Link to={`/channel/${video.owner[0]._id}`} className="mr-2">
                  <img
                    className="w-10 h-10 rounded-full"
                    src={video.owner[0].avatar}
                    alt="avatar"
                  />
                </Link>
                <div>
                  <div className="font-semibold text-lg">{video.title}</div>
                  <div>
                    <Link
                      to={`/channel/${video.owner[0]._id}`}
                      className="font-semibold text-gray-400 hover:text-gray-300"
                    >
                      {video.owner[0].username}
                    </Link>
                  </div>
                  <div className="flex">
                    <div className="mr-2">{convertViews(video.views)} views .</div>
                    <div>{timeDifference(video.createdAt)} ago</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default Home;
