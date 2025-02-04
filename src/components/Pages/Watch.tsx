import { useEffect, useState, lazy, Suspense } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BACKEND_URL_PREFIX } from "../../constants";
import axios from "axios";
import { useSelector } from "react-redux";
import ReactPlayer from "react-player";
import timeDifference from "../../helpers/timeDifference";
import { BiSolidLike } from "react-icons/bi";
import { BiLike } from "react-icons/bi";
import { toast } from "react-toastify";
//lazy load video comments component
const LazyVideoComments = lazy(() => import('../VideoComments'));

const Watch = () => {
  const user = useSelector((store) => store.user.loggedInUserDetails);
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("v");
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState(null);
  const [commentsCountUI, setCommentsCountUI] = useState(null);
  const [commentUI, setCommentUI] = useState("");
  const [playlists, setPlaylists] = useState(null);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [showNewPlaylistForm, setShowNewPlaylistForm] = useState(false);
  
  if (!localStorage.getItem("isLoggedIn")) {
    return "Please log in to watch videos";
  }

  const fetchVideo = async () => {
    const res = await axios.get(`${BACKEND_URL_PREFIX}/videos/${videoId}`, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    setVideo(res.data.data);
  };

  const fetchComments = async () => {
    const res = await axios.get(
      `${BACKEND_URL_PREFIX}/comments/videoComments/${videoId}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    setCommentsCountUI(res.data.data.commentsCount);
    setComments(res.data.data.comments);
  };

  useEffect(() => {
    fetchVideo();
    fetchComments();
  }, []);

  const handleToggleSubscribe = async () => {
    //to immediately show change in UI
    setVideo((prevVideo) => ({
      ...prevVideo,
      isSubscribed: !prevVideo.isSubscribed,
      subscribersCount: prevVideo.isSubscribed
        ? prevVideo.subscribersCount - 1
        : prevVideo.subscribersCount + 1,
    }));

    const res = await axios.post(
      `${BACKEND_URL_PREFIX}/subscriptions/${video.owner[0]._id}`,
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.data.statusCode === 200) {
      toast(res.data.message);
    } else {
      toast("Toggling subscription failed");
    }
  };

  const handleToggleVideoLike = async () => {
    //to immediately show change in UI
    setVideo((prevVideo) => ({
      ...prevVideo,
      isLiked: !prevVideo.isLiked,
      likesCount: prevVideo.isLiked
        ? prevVideo.likesCount - 1
        : prevVideo.likesCount + 1,
    }));

    const res = await axios.post(
      `${BACKEND_URL_PREFIX}/likes/toggleVideoLike/${video._id}`,
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.data.statusCode === 200) {
      toast(res.data.message);
    } else {
      toast("Toggling like failed");
    }
  };

  const handleAddComment = async () => {
    if (!commentUI?.trim()) {
      return;
    }

    const res = await axios.post(
      `${BACKEND_URL_PREFIX}/comments/addVideoComment/${video._id}`,
      {
        content: commentUI,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    setCommentUI("");
    // immediately updating UI
    if (res.data.statusCode === 200) {
      const newComment = {
        ...res.data.data,
        owner: [
          {
            _id: res.data.data.owner,
            avatar: user.avatar,
            username: user.username,
          },
        ],
        isLiked: false,
        likesCount: 0,
      };
      setComments((prevComments) => [...prevComments, newComment]);
      setCommentsCountUI((prevCount) => prevCount + 1);
      if (res.data.statusCode === 200) {
        toast("Comment added successfully");
      } else {
        toast("Could not add comment. Please try again.");
      }
    }
  };

  const handleDeleteComment = async (commentId) => {
    //to immediately show change in UI
    setComments(comments.filter((comment) => comment._id !== commentId));
    setCommentsCountUI((prevCount) => prevCount - 1);

    const res = await axios.delete(
      `${BACKEND_URL_PREFIX}/comments/deleteVideoComment/${videoId}/${commentId}`,
      {
        withCredentials: true,
      }
    );
    if (res.data.statusCode === 200) {
      toast("comment deleted successfully");
    } else {
      toast("comment deletion failed");
    }
  };

  const handleToggleCommentLike = async (commentId) => {
    //to immediately show change in UI
    setComments((prevComments) =>
      prevComments.map((comment) =>
        comment._id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likesCount: comment.isLiked
                ? comment.likesCount - 1
                : comment.likesCount + 1,
            }
          : comment
      )
    );

    const res = await axios.post(
      `${BACKEND_URL_PREFIX}/likes/toggleCommentLike/${commentId}`,
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (res.data.statusCode === 200) {
      toast(res.data.message);
    } else {
      toast("Toggling comment like failed");
    }
  };

  const fetchPlaylists = async () => {
    const res = await axios.get(
      `${BACKEND_URL_PREFIX}/playlists/getAllForAVideo/${videoId}`,
      {
        withCredentials: true,
      }
    );
    if (res.data.statusCode === 200) {
      console.log(res.data.data);
      setPlaylists(res.data.data);
    }
  };

  const handleShowPlaylists = () => {
    setShowPlaylists(true);
    fetchPlaylists();
  };

  const handleToggleAddToPlaylist = async (playlistId) => {
    // immediately update UI
    setPlaylists((prevPlaylist) =>
      prevPlaylist.map((playlist) =>
        playlist._id === playlistId
          ? { ...playlist, isChecked: !playlist.isChecked }
          : playlist
      )
    );

    const res = await axios.patch(
      `${BACKEND_URL_PREFIX}/playlists/toggleAddVideo/${playlistId}/${videoId}`,
      {},
      {
        withCredentials: true,
      }
    );
    if (res.data.statusCode === 200) {
      toast(res.data.message);
    } else {
      toast("Toggling video to playlist failed");
    }
  };

  const handleCreatePlaylistAndAddAVideo = async () => {
    if (!playlistName?.trim()) {
      alert("playlist name is required");
      return;
    }

    //immediately update UI
    setShowPlaylists(false);
    setPlaylistName("");

    const res = await axios.post(
      `${BACKEND_URL_PREFIX}/playlists/create/${videoId}`,
      {
        name: playlistName,
      },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    if (res.data.statusCode !== 200) {
      toast("playlist creation failed");
    } else {
      toast("playlist created and video added successfully");
    }
  };

  if (!video) {
    return "Loading ...";
  }

  return (
    <div className="w-[60vw] h-[90vh] overflow-y-scroll px-4">
      <div className="w-full">
        <ReactPlayer url={video.videoFile} width="710px" height="360px" controls={true} />

        <div>
          <div className="font-semibold text-xl my-2">{video.title}</div>
          <div className="flex mt-3 items-center">
            <div className="mr-3">
              <Link to={`/channel/${video.owner[0]._id}`}>
                <img
                  className="w-10 h-10 rounded-full"
                  src={video.owner[0].avatar}
                  alt="avatar"
                  loading="lazy"
                />
              </Link>
            </div>
            <div className="mr-10">
              <Link
                to={`/channel/${video.owner[0]._id}`}
                className="font-semibold"
              >
                {video.owner[0].username}
              </Link>
              <div>{video.subscribersCount} subscribers</div>
            </div>
            {user._id !== video.owner[0]._id && (
              <button
                className="font-semibold bg-blue-800 hover:bg-blue-600 px-5 py-2 rounded-full"
                onClick={handleToggleSubscribe}
              >
                {video.isSubscribed ? "Subscribed" : "Subscribe"}
              </button>
            )}

            <div className="ml-auto flex mr-2">
              <div className="mr-2 border border-gray-400 p-2 rounded-md my-2 flex items-center">
                <span className="text-white mr-1">{video.likesCount}</span>
                <span
                  className={"cursor-pointer"}
                  onClick={handleToggleVideoLike}
                >
                  {video.isLiked ? <BiSolidLike /> : <BiLike />}
                </span>
              </div>
            </div>
            <button
              className="p-2 bg-blue-800 hover:bg-blue-600 text-white font-semibold mr-2"
              onClick={handleShowPlaylists}
            >
              Save To Playlist
            </button>
          </div>
        </div>

        {/* all playlists popup*/}
        {showPlaylists && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
            <div className="bg-black p-5 rounded shadow-lg w-3/12">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4 w-full"
                onClick={() => {
                  setShowPlaylists(false);
                  setShowNewPlaylistForm(false);
                  setPlaylistName("");
                }}
              >
                Close
              </button>
              <div className="my-5">
                {playlists &&
                  playlists.map((playlist) => (
                    <div key={playlist._id} className="mb-3 flex items-center">
                      <input
                        className="w-6 h-6 mr-3"
                        type="checkbox"
                        checked={playlist.isChecked}
                        onChange={() => handleToggleAddToPlaylist(playlist._id)}
                      />
                      <label className="text-lg">{playlist.name}</label>
                    </div>
                  ))}
              </div>
              <button
                className={
                  "bg-blue-700 text-white px-3 py-2 font-semibold" +
                  (showNewPlaylistForm && " hidden")
                }
                onClick={() => setShowNewPlaylistForm(true)}
              >
                Create New Playlist
              </button>
              {/* handleCreatePlaylist */}
              {showNewPlaylistForm && (
                <div className="mt-5">
                  <input
                    className="border-b focus:border-b-2 w-full p-2 outline-none mb-2 bg-black"
                    type="text"
                    placeholder="Enter playlist name"
                    value={playlistName}
                    onChange={(e) => setPlaylistName(e.target.value)}
                  />
                  <button
                    className="bg-blue-700 text-white py-2 px-4 w-full"
                    onClick={handleCreatePlaylistAndAddAVideo}
                  >
                    Create
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="border border-gray-300 mt-5 p-2 rounded-md">
          <div className="flex font-semibold">
            <div className="mr-3">{video.views} views</div>
            <div>{timeDifference(video.createdAt)} ago</div>
          </div>
          <div>{video.description}</div>
        </div>

        <h1 className="mt-3 font-semibold text-xl mb-2">
          {commentsCountUI} Comments
        </h1>

        <form className="p-1 flex" onSubmit={(e) => e.preventDefault()}>
          <img
            className="w-12 h-10 rounded-full mr-2"
            src={user.avatar}
            alt="avatar"
            loading="lazy"
          />
          <input
            className={
              "bg-black bg-opacity-10 border-b w-full outline-none focus:border-white focus:border-b-2 mx-2 p-2" +
              (!localStorage.getItem("isLoggedIn")
                ? " placeholder-red-500"
                : "")
            }
            type="text"
            value={commentUI}
            onChange={(e) => setCommentUI(e.target.value)}
            placeholder={
              !localStorage.getItem("isLoggedIn")
                ? "Please login to add your comment"
                : "Add a comment..."
            }
            disabled={!localStorage.getItem("isLoggedIn")}
          />
          <button
            className="bg-blue-700 hover:bg-blue-500 text-white py-2 px-3 rounded-lg"
            onClick={handleAddComment}
            disabled={!localStorage.getItem("isLoggedIn")}
          >
            Comment
          </button>
        </form>

        <div className="mt-2">
          <Suspense fallback={<div>Loading...</div>}>
            {comments && (
              <LazyVideoComments
                comments={comments}
                user={user}
                video={video}
                handleToggleCommentLike={handleToggleCommentLike}
                handleDeleteComment={handleDeleteComment}
              />
            )}
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default Watch;
