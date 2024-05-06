import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL_PREFIX } from "../../constants";
import { useParams } from "react-router-dom";
import LikedIcon from "../../../assets/likedIcon.png";
import LikeIcon from "../../../assets/likeIcon.png";
import { useSelector } from "react-redux";
import timeDifference from "../../helpers/timeDifference";

const Tweets = () => {
  const user = useSelector((store) => store.user.loggedInUserDetails);
  const { channelId } = useParams();
  const [tweets, setTweets] = useState(null);
  const [showEditTweetForm, setShowEditTweetForm] = useState(false);
  const [tweetContent, setTweetContent] = useState("");
  const [editTweetId, setEditTweetId] = useState("");
  const [tweet, setTweet] = useState("");

  const fetchTweets = async () => {
    const res = await axios.get(
      `${BACKEND_URL_PREFIX}/tweets/get/${channelId}`,
      {
        withCredentials: true,
      }
    );
    console.log(res.data.data);
    if (res.data.statusCode === 200) {
      setTweets(res.data.data);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, []);

  const handleCreateTweet = async () => {
    const res = await axios.post(
      `${BACKEND_URL_PREFIX}/tweets/create/${channelId}`,
      {
        content: tweet,
      },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    setTweet("");
    
    console.log(res.data);
    if (res.data.statusCode === 200) {
      console.log("inside if");
      const newTweet = {
        ...res.data.data,
        likesCount: 0,
        isLiked: false,
        owner: [
          {
            avatar: user.avatar,
            username: user.username,
          },
        ],
      };
      setTweets((prevTweet) => [...prevTweet, newTweet]);
    }
  };

  const handleEditTweet = (tweetContent, tweetId) => {
    setTweetContent(tweetContent);
    setEditTweetId(tweetId);
    setShowEditTweetForm(true);
  };

  const updateTweetApi = async () => {
    //immediately update UI
    setTweets((prevTweet) =>
      prevTweet.map((tweet) =>
        tweet._id === editTweetId ? { ...tweet, content: tweetContent } : tweet
      )
    );

    setShowEditTweetForm(false);

    await axios.patch(
      `${BACKEND_URL_PREFIX}/tweets/update/${channelId}/${editTweetId}`,
      {
        content: tweetContent,
      },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
  };

  const handleDeleteTweet = async (tweetId) => {
    //immediately update UI
    setTweets((prevTweet) =>
      prevTweet.filter((tweet) => tweet._id !== tweetId)
    );

    await axios.delete(
      `${BACKEND_URL_PREFIX}/tweets/delete/${channelId}/${tweetId}`,
      {
        withCredentials: true,
      }
    );
  };

  const handleToggleTweetLike = async (tweetId) => {
    //immediately update UI
    setTweets((prevTweet) =>
      prevTweet.map((tweet) =>
        tweet._id === tweetId
          ? {
              ...tweet,
              isLiked: !tweet.isLiked,
              likesCount: tweet.isLiked
                ? tweet.likesCount - 1
                : tweet.likesCount + 1,
            }
          : tweet
      )
    );

    await axios.post(
      `${BACKEND_URL_PREFIX}/likes/toggleTweetLike/${tweetId}`,
      {},
      {
        withCredentials: true,
      }
    );
  };

  if (!tweets) {
    return "loading...";
  }

  if (tweets.length === 0) {
    return "No tweets available";
  }

  return (
    <div className="mb-3">
      {/* edit tweet form */}
      {showEditTweetForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-5 rounded shadow-lg w-3/12">
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={() => {
                setShowEditTweetForm(false);
                setTweetContent("");
              }}
            >
              Close
            </button>
            <textarea
              className="border mx-5 h-36"
              value={tweetContent}
              onChange={(e) => setTweetContent(e.target.value)}
              placeholder="Enter your tweet"
            />
            <button
              className="bg-lime-700 hover:bg-lime-500 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={updateTweetApi}
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* create tweet form */}
      <form
        className="my-3 border w-10/12 flex py-2"
        onSubmit={(e) => e.preventDefault()}
      >
        <img
          className="w-10 h-10 rounded-full mx-3"
          src={user.avatar}
          alt="avatar"
        />
        <input
          className="border w-11/12 p-2 mr-2"
          type="text"
          value={tweet}
          onChange={(e) => setTweet(e.target.value)}
          placeholder="Enter your tweet"
        />
        <button
          className="bg-blue-700 text-white font-semibold py-2 px-4 mr-2"
          onClick={handleCreateTweet}
        >
          Tweet
        </button>
      </form>

      {tweets.map((tweet) => (
        <div key={tweet._id} className="border w-8/12 flex p-5 rounded-md mb-5">
          <div className="mr-3">
            <img
              className="w-10 h-10 rounded-full"
              src={tweet.owner[0].avatar}
            />
          </div>

          <div>
            <div>
              <span className="mr-2 font-semibold">
                {tweet.owner[0].username}
              </span>
              <span>{timeDifference(tweet.createdAt)} ago</span>
            </div>

            <div>{tweet.content}</div>

            <div className="flex">
              <span className="mr-1">{tweet.likesCount}</span>
              <span onClick={() => handleToggleTweetLike(tweet._id)}>
                <img
                  className="w-5 cursor-pointer"
                  src={tweet.isLiked ? LikedIcon : LikeIcon}
                />
              </span>
            </div>
          </div>

          {user._id === channelId && (
            <div className="flex flex-col ml-auto">
              <button
                className="bg-blue-700 text-white p-2 rounded-sm mb-2"
                onClick={() => handleEditTweet(tweet.content, tweet._id)}
              >
                Edit Tweet
              </button>
              <button
                className="bg-red-700 text-white p-2 rounded-sm"
                onClick={() => handleDeleteTweet(tweet._id)}
              >
                Delete Tweet
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Tweets;
