import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL_PREFIX } from "../../constants";
import { useParams } from "react-router-dom";

const LikedVideos = () => {
  const [likedVideos, setLikedVideos] = useState(null);
  const [likedVideosCount, setLikedVideosCount] = useState(null);

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

      <div className="mb-2">
        <h1 className="text-4xl mb-2">Liked Videos</h1>
        <h3 className="font-semibold text-gray-600">{likedVideosCount} videos</h3>
      </div>

      {likedVideos.map((video) => (
        <div key={video._id} className="border w-full flex mb-5">
          <div>
            <div className="absolute bg-black text-white py-1 px-2 rounded-md">
              {video.likedVideos[0].duration.toFixed(2)}
            </div>
            <div className="mr-2">
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
              <div className="mr-2">
                {video.likedVideos[0].owner[0].username} .
              </div>
              <div className="mr-2">{video.likedVideos[0].views} views .</div>
              <div>{video.likedVideos[0].createdAt} ago</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LikedVideos;
