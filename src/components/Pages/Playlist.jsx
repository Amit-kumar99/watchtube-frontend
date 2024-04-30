import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL_PREFIX } from "../../constants";
import { useParams } from "react-router-dom";

const Playlist = () => {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [videosCount, setVideosCount] = useState(null);

  const fetchPlaylist = async () => {
    const res = await axios.get(
      `${BACKEND_URL_PREFIX}/playlists/get/${playlistId}`,
      {
        withCredentials: true,
      }
    );
    console.log(res.data.data);
    if (res.data.statusCode === 200) {
      setPlaylist(res.data.data.playlist);
      setVideosCount(res.data.data.videosCount);
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, []);

  const handleRemoveVideoFromPlaylist = () => {}

  if (!playlist) {
    return "loading...";
  }

  return (
    <div className="mb-2 mx-5 w-full">
      <div className="mb-2">
        <h1 className="text-4xl mb-2">{playlist.name}</h1>
        <h3 className="text-2xl mb-2">{playlist.owner.username}</h3>
        <h3 className="font-semibold text-gray-600">{videosCount} videos</h3>
      </div>

      {playlist.videos.map((video) => (
        <div key={video._id} className="flex mb-5 border w-full justify-between">
          <div className="flex">
            <div>
              <div className="absolute bg-black text-white py-1 px-2 rounded-md">
                {video.duration.toFixed(2)}
              </div>
              <div className="mr-2">
                <img
                  className="w-56 h-40 rounded-lg"
                  src={video.thumbnail}
                  alt="thumbnail"
                />
              </div>
            </div>

            <div>
              <div className="font-semibold mt-1">{video.title}</div>
              <div className="flex mt-2">
                <div className="mr-2">{video.owner.username} .</div>
                <div className="mr-2">{video.views} views .</div>
                <div>{video.createdAt} ago</div>
              </div>
            </div>
          </div>

          <div>
            <button className="bg-blue-700 text-white p-2 rounded-md" onClick={handleRemoveVideoFromPlaylist}>Remove From Playlist</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Playlist;