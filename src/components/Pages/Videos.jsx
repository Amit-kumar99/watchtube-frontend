import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL_PREFIX } from "../../constants";
import { useParams } from "react-router-dom";

const Videos = () => {
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

  if (!videos) {
    return "loading...";
  }

  return (
    <div className="flex flex-wrap mb-3">
      {videos.map((video) => (
        <div key={video._id} className="border w-3/12">
          <div className="absolute bg-black text-white py-1 px-2 rounded-md">{video.duration.toFixed(2)}</div>
          <div><img className="w-full" src={video.thumbnail} alt="thumbnail"/></div>
          <div className="font-semibold mt-1">{video.title}</div>
          <div className="flex">
            <div className="mr-2">{video.views} views .</div>
            <div>{video.createdAt} ago</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Videos;
