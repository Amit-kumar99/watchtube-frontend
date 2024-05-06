import { useState, useEffect } from "react";
import { BACKEND_URL_PREFIX } from "../../constants";
import { Link } from "react-router-dom";
import timeDifference from "../../helpers/timeDifference";
import convertDuration from "../../helpers/convertDuration";

const Home = () => {
  const [videos, setVideos] = useState([]);

  const fetchVideos = async () => {
    const data = await fetch(`${BACKEND_URL_PREFIX}/videos/getAll`);
    const res = await data.json();
    setVideos(res.data.videos);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <div className="border w-full ml-10">
      <div className="flex flex-wrap border w-full">
        {videos.length !== 0 &&
          videos.map((video) => (
            <Link
              to={`/watch?v=${video._id}`}
              key={video._id}
              className="border w-[31%] mr-5 mb-5"
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
                <div className="mr-2">
                  <img
                    className="w-10 h-10 rounded-full"
                    src={video.owner[0].avatar}
                    alt="avatar"
                  />
                </div>
                <div>
                  <div className="font-semibold text-lg">{video.title}</div>
                  <div>
                    <Link
                      to={`/channel/${video.owner[0]._id}`}
                      className="font-semibold text-gray-600 hover:text-gray-400"
                    >
                      {video.owner[0].username}
                    </Link>
                  </div>
                  <div className="flex">
                    <div className="mr-2">{video.views} views .</div>
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
