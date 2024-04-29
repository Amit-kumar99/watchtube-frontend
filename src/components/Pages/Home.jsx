import { useState, useEffect } from "react";
import { BACKEND_URL_PREFIX } from "../../constants";
import { Link } from "react-router-dom";

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
    <div className="border w-full">
      <div className="flex flex-wrap border w-full">
        {videos.length !== 0 &&
          videos.map((video) => (
            <Link
              to={`/watch?v=${video._id}`}
              key={video._id}
              className="border w-3/12 mr-5 mb-5"
            >
              <div className="absolute bg-black text-white p-1">
                {video.duration.toFixed(2)}
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
                  <div>{video.owner[0].username}</div>
                  <div className="flex">
                    <div className="mr-2">{video.views} views .</div>
                    <div>{video.createdAt}</div>
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
