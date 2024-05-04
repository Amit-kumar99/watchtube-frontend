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

  const handleEditTweet = () => {};

  const handleDeleteTweet = () => {};

  const handleToggleTweetLike = () => {};

  if (!tweets) {
    return "loading...";
  }

  if (tweets.length === 0) {
    return "No tweets available";
  }

  return (
    <div className="mb-3">
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
              <span onClick={handleToggleTweetLike}>
                <img className="w-5 cursor-pointer" src={tweet.isLiked ? LikedIcon : LikeIcon} />
              </span>
            </div>
          </div>

          {(user._id === channelId) && (<div className="flex flex-col ml-auto">
            <button
              className="bg-blue-700 text-white p-2 rounded-sm mb-2"
              onClick={handleEditTweet}
            >
              Edit Tweet
            </button>
            <button
              className="bg-red-700 text-white p-2 rounded-sm"
              onClick={handleDeleteTweet}
            >
              Delete Tweet
            </button>
          </div>)}
        </div>
      ))}
    </div>
  );
};

export default Tweets;
