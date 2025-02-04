import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL_PREFIX } from "../../constants";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import timeDifference from "../../helpers/timeDifference";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { toast } from "react-toastify";

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

    const res = await axios.patch(
      `${BACKEND_URL_PREFIX}/tweets/update/${channelId}/${editTweetId}`,
      {
        content: tweetContent,
      },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    if (res.data.statusCode === 200) {
      toast("tweet edited successfully");
    } else {
      toast("tweet editing failed. Please try again.");
    }
  };

  const handleDeleteTweet = async (tweetId) => {
    //immediately update UI
    setTweets((prevTweet) =>
      prevTweet.filter((tweet) => tweet._id !== tweetId)
    );

    const res = await axios.delete(
      `${BACKEND_URL_PREFIX}/tweets/delete/${channelId}/${tweetId}`,
      {
        withCredentials: true,
      }
    );
    if (res.data.statusCode === 200) {
      toast("tweet deleted successfully");
    } else {
      toast("tweet deletion failed. Please try again.");
    }
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

    const res = await axios.post(
      `${BACKEND_URL_PREFIX}/likes/toggleTweetLike/${tweetId}`,
      {},
      {
        withCredentials: true,
      }
    );
    if (res.data.statusCode === 200) {
      toast(res.data.message);
    } else {
      toast("Toggling like failed");
    }
  };

  if (!tweets) {
    return "loading...";
  }

  return (
    <div className="mb-3">
      {/* edit tweet form */}
      {showEditTweetForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-black p-5 rounded shadow-lg w-3/12">
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
              className="border mx-5 h-36 bg-black p-2"
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
      { user._id === tweets[0].owner[0]._id && 
      (<form
        className="w-10/12 flex py-5 my-5"
        onSubmit={(e) => e.preventDefault()}
      >
        <img
          className="w-10 h-10 rounded-full mx-3"
          src={user.avatar}
          alt="avatar"
          loading="lazy"
        />
        <input
          className="border w-11/12 p-2 mr-2 bg-black bg-opacity-0 rounded-md"
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
      </form>)}

      {tweets.length === 0 && "No tweets available"}

      {tweets.length !== 0 &&
        tweets.map((tweet) => (
          <div
            key={tweet._id}
            className="border border-gray-500 w-10/12 flex p-5 rounded-md mb-5"
          >
            <div className="mr-3">
              <img
                className="w-10 h-10 rounded-full"
                src={tweet.owner[0].avatar}
                loading="lazy"
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

              <div className="flex items-center">
                <span className="mr-1">{tweet.likesCount}</span>
                <span className="cursor-pointer" onClick={() => handleToggleTweetLike(tweet._id)}>
                  {tweet.isLiked ? <BiSolidLike /> : <BiLike />}
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
