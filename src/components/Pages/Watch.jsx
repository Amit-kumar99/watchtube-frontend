import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BACKEND_URL_PREFIX } from "../../constants";
import axios from "axios";
import { useSelector } from "react-redux";
import LikeIcon from "../../../assets/likeIcon.png";
import LikedIcon from "../../../assets/likedIcon.png";
import ReactPlayer from "react-player";
import timeDifference from "../../helpers/timeDifference";

const Watch = () => {
  const user = useSelector((store) => store.user.loggedInUserDetails);
  const [searchParams] = useSearchParams();
  const videoId = searchParams.get("v");
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState(null);
  const [commentsCountUI, setCommentsCountUI] = useState(null);
  const [commentUI, setCommentUI] = useState("");

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

    await axios.post(
      `${BACKEND_URL_PREFIX}/subscriptions/${video.owner[0]._id}`,
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
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

    await axios.post(
      `${BACKEND_URL_PREFIX}/likes/toggleVideoLike/${video._id}`,
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
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
    // immediately updating UI
    console.log(res.data);
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
    }
  };

  const handleDeleteComment = async (commentId) => {
    //to immediately show change in UI
    setComments(comments.filter((comment) => comment._id !== commentId));
    setCommentsCountUI((prevCount) => prevCount - 1);

    await axios.delete(
      `${BACKEND_URL_PREFIX}/comments/deleteVideoComment/${videoId}/${commentId}`,
      {
        withCredentials: true,
      }
    );
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

    await axios.post(
      `${BACKEND_URL_PREFIX}/likes/toggleCommentLike/${commentId}`,
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  };

  if (!video) {
    return "Loading ...";
  }

  return (
    <div className="border w-[50vw] h-[90vh] overflow-y-scroll">
      <div className="w-full border border-black">
        <ReactPlayer url={video.videoFile} width="830px" controls={true} />

        <div>
          <div className="font-semibold text-xl">{video.title}</div>
          <div className="flex mt-3 border items-center">
            <div className="mr-3">
              <Link to={`/channel/${video.owner[0]._id}`}>
                <img
                  className="w-10 h-10 rounded-full"
                  src={video.owner[0].avatar}
                  alt="avatar"
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
                className="font-semibold bg-gray-300 px-5 py-2 rounded-full hover:bg-gray-200"
                onClick={handleToggleSubscribe}
              >
                {video.isSubscribed ? "Subscribed" : "Subscribe"}
              </button>
            )}

            <div className="ml-auto flex border">
              <div className="mr-2 bg-gray-400 p-1 rounded-md my-2 flex">
                <span className="text-white mr-1">{video.likesCount}</span>
                <span
                  className={"cursor-pointer"}
                  onClick={handleToggleVideoLike}
                >
                  <img
                    className="w-5"
                    src={video.isLiked ? LikedIcon : LikeIcon}
                    alt="like-icon"
                  />
                </span>
              </div>
            </div>
          </div>
          {/* <button
              className="p-2 bg-blue-700 text-white font-semibold"
              onClick={() => showPlaylists(true)}
              >
              Save To Playlist
              </button> */}
        </div>
        {/* <div>
  {playlists.map(p => (
    <div key={p._id}>
      <input type="checkbox" onChange={toggleAddToPlaylist}/>
      <label>{p.name}</label>
    </div>
  ))}
</div>  */}

        <div className="bg-gray-300 mt-5 p-2 rounded-md">
          <div className="flex font-semibold">
            <div className="mr-3">{video.views} views</div>
            <div>{timeDifference(video.createdAt)} ago</div>
          </div>
          <div>{video.description}</div>
        </div>

        <h1 className="mt-2 font-semibold text-xl mb-2">
          {commentsCountUI} Comments
        </h1>

        <form className="p-1 flex" onSubmit={(e) => e.preventDefault()}>
          <img
            className="w-12 h-10 rounded-full mr-2"
            src={user.avatar}
            alt="avatar"
          />
          <input
            className={
              "border-b w-full outline-none focus:border-black focus:border-b-2" +
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

        <div className="mt-2 border">
          <div>
            {comments &&
              comments.map((comment) => (
                <div className="border" key={comment._id}>
                  <div className="flex p-2">
                    <div className="mr-2">
                      <Link to={`/channel/${comment.owner[0]._id}`}>
                        <img
                          className="w-10 h-10 rounded-full"
                          src={comment.owner[0].avatar}
                          alt="avatar"
                        />
                      </Link>
                    </div>
                    <div>
                      <div className="flex">
                        <Link to={`/channel/${comment.owner[0]._id}`}>
                          <div className="font-semibold mr-2">
                            {comment.owner[0].username}
                          </div>
                        </Link>
                        <div className="text-xs mt-[2px] text-gray-600">
                          {timeDifference(comment.createdAt)} ago
                        </div>
                      </div>
                      <div>{comment.content}</div>
                      <div className="flex">
                        <span className="mr-1">{comment.likesCount}</span>
                        <span
                          className="cursor-pointer"
                          onClick={() => handleToggleCommentLike(comment._id)}
                        >
                          <img
                            className="w-5"
                            src={comment.isLiked ? LikedIcon : LikeIcon}
                            alt="like-icon"
                          />
                        </span>
                      </div>
                    </div>
                    {(user._id === video.owner[0]._id ||
                      user._id === comment.owner[0]._id) && (
                      <button
                        className="ml-auto flex flex-col items-center my-auto px-2 py-1 bg-red-700 hover:bg-red-500 text-white"
                        onClick={() => handleDeleteComment(comment._id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;
