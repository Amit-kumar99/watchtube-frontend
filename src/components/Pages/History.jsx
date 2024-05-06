import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL_PREFIX } from "../../constants";
import { Link } from "react-router-dom";
import convertDuration from "../../helpers/convertDuration";

const History = () => {
  const [watchedVideos, setWatchedVideos] = useState(null);

  if (!localStorage.getItem("isLoggedIn")) {
    return "Please log in to see your history";
  }

  const fetchWatchedVideos = async () => {
    const res = await axios.get(`${BACKEND_URL_PREFIX}/users/watchHistory`, {
      withCredentials: true,
    });
    console.log(res.data.data);
    if (res.data.statusCode === 200) {
      setWatchedVideos(res.data.data.videos);
    }
  };

  useEffect(() => {
    fetchWatchedVideos();
  }, []);

  if (!watchedVideos) {
    return "loading...";
  }

  return (
    <div className="flex w-full ml-5">
      <div className="w-7/12 mr-10 border">
        <h1 className="font-semibold text-3xl border mb-7">Watch History</h1>
        <div>
          {watchedVideos.map((video) => (
            <Link to={`/watch?v=${video._id}`} key={video._id} className="border w-full flex mb-5">
              <div className="w-4/12">
                <div className="absolute bg-black text-white py-1 px-2 rounded-md">
                  {convertDuration(Math.floor(video.duration))}
                </div>
                <div className="mr-5">
                  <img
                    className="w-full h-40 rounded-lg"
                    src={video.thumbnail}
                    alt="thumbnail"
                  />
                </div>
              </div>
              <div className="w-8/12">
                <div className=" mt-1 text-2xl">{video.title}</div>
                <div className="text-gray-500 text-sm mt-1">
                  <span className="font-semibold mr-2">{video.owner[0].username} .</span>
                  <span className="mr-2">{video.views} views</span>
                </div>
                <div className="text-gray-500 text-sm mt-2 w-full">{video.description}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Link className="w-2/12" to="/comments">
        <h1 className="font-semibold text-xl hover:text-blue-500 cursor-pointer border">
          Comments History
        </h1>
      </Link>
    </div>
  );
};

export default History;
