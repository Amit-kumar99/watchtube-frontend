import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL_PREFIX } from "../../constants";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const Playlists = () => {
  const user = useSelector((store) => store.user.loggedInUserDetails);
  const { channelId } = useParams();
  const [playlists, setPlaylists] = useState(null);

  const fetchPlaylists = async () => {
    const res = await axios.get(
      `${BACKEND_URL_PREFIX}/playlists/getAll/${channelId}`,
      {
        withCredentials: true,
      }
    );
    console.log(res.data.data);
    if (res.data.statusCode === 200) {
      setPlaylists(res.data.data);
    }
  };

  useEffect(() => {
    fetchPlaylists();
  }, []);

  const handleUpdatePlaylist = () => {};

  const handleDeletePlaylist = () => {};

  if (!playlists) {
    return "loading...";
  }

  if (playlists.length === 0) {
    return "No playlist available";
  }

  return (
    <div className="flex flex-wrap mb-3">
      {playlists.map((playlist) => (
        <div key={playlist._id} className="border w-3/12 mr-5">
          <div className="font-semibold mt-1">{playlist.name}</div>
          <div className="mr-2">{playlist.videosCount} videos</div>
          <div>{playlist.updatedAt} ago</div>
          <div>
            <Link className="font-semibold" to={`/playlist/${playlist._id}`}>
              View Full Playlist
            </Link>
          </div>
          {(user._id === channelId) && (<div className="flex justify-between mt-1">
            <button
              className="bg-blue-700 text-white p-2 rounded-sm"
              onClick={handleUpdatePlaylist}
            >
              Update Playlist
            </button>
            <button
              className="bg-red-700 text-white p-2 rounded-sm"
              onClick={handleDeletePlaylist}
            >
              Delete Playlist
            </button>
          </div>)}
        </div>
      ))}
    </div>
  );
};

export default Playlists;
