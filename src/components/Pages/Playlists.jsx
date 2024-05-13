import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL_PREFIX } from "../../constants";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import timeDifference from "../../helpers/timeDifference";
import { toast } from "react-toastify";

const Playlists = () => {
  const user = useSelector((store) => store.user.loggedInUserDetails);
  const { channelId } = useParams();
  const [playlists, setPlaylists] = useState(null);
  const [showEditPlaylistForm, setShowEditPlaylistForm] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [editPlaylistId, setEditPlaylistId] = useState(null);

  if (!localStorage.getItem("isLoggedIn")) {
    return "Please log in to see playlists";
  }

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

  const handleUpdatePlaylist = (name, playlistId) => {
    setPlaylistName(name);
    setEditPlaylistId(playlistId);
    setShowEditPlaylistForm(true);
  };

  const updatePlaylistApi = async () => {
    if (playlistName.trim() === "") {
      alert("playlist name can't be empty");
      return;
    }

    //immediately update UI
    setPlaylists((prevPlaylist) =>
      prevPlaylist.map((playlist) =>
        playlist._id === editPlaylistId
          ? {
              ...playlist,
              name: playlistName,
            }
          : playlist
      )
    );
    setShowEditPlaylistForm(false);

    const res = await axios.patch(
      `${BACKEND_URL_PREFIX}/playlists/update/${editPlaylistId}`,
      {
        name: playlistName,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.data.statusCode === 200) {
      toast("playlist edited successfully");
    } else {
      toast("playlist editing failed. Please try again.");
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    //immediately update UI
    setPlaylists((prevPlaylist) =>
      prevPlaylist.filter((playlist) => playlist._id !== playlistId)
    );

    const res = await axios.delete(`${BACKEND_URL_PREFIX}/playlists/delete/${playlistId}`, {
      withCredentials: true,
    });
    if (res.data.statusCode === 200) {
      toast("playlist deleted successfully");
    } else {
      toast("playlist deletion failed. Please try again.");
    }
  };

  if (!playlists) {
    return "loading...";
  }

  if (playlists.length === 0) {
    return "No playlist available";
  }

  return (
    <div className="flex flex-wrap mb-3">
      {/* edit Playlist form */}
      {showEditPlaylistForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-black p-5 rounded shadow-lg w-3/12">
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 mx-5"
              onClick={() => {
                setShowEditPlaylistForm(false);
                setPlaylistName("");
              }}
            >
              Close
            </button>
            <input
              className="bg-black border-b outline-none focus:border-b-2 focus:border-white"
              type="text"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
              placeholder="Enter new name"
            />
            <button
              className="bg-lime-700 hover:bg-lime-500 text-white font-bold py-2 px-4 rounded mt-4 ml-3"
              onClick={updatePlaylistApi}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {playlists.map((playlist) => (
        <div
          key={playlist._id}
          className="border border-gray-500 p-2 w-3/12 mr-5 mb-3"
        >
          <div className="font-semibold mt-1">{playlist.name}</div>
          <div className="mr-2">{playlist.videosCount} videos</div>
          <div>Updated {timeDifference(playlist.updatedAt)} ago</div>
          <div>
            <Link
              className="font-semibold hover:text-gray-400"
              to={`/playlist/${playlist._id}`}
            >
              View Full Playlist
            </Link>
          </div>
          {user._id === channelId && (
            <div className="flex justify-between mt-1">
              <button
                className="bg-blue-700 text-white p-2 rounded-sm"
                onClick={() =>
                  handleUpdatePlaylist(playlist.name, playlist._id)
                }
              >
                Update Playlist
              </button>
              <button
                className="bg-red-700 text-white p-2 rounded-sm"
                onClick={() => handleDeletePlaylist(playlist._id)}
              >
                Delete Playlist
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Playlists;
