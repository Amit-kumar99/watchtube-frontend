import { BiSolidLike } from "react-icons/bi";
import { BiLike } from "react-icons/bi";
import { Link } from "react-router-dom";
import timeDifference from "../helpers/timeDifference";

const VideoComments = ({
  comments,
  user,
  video,
  handleToggleCommentLike,
  handleDeleteComment,
}) => {
  return (
    <div>
      {comments.map((comment) => (
        <div className="border-b py-3" key={comment._id}>
          <div className="flex p-2">
            <div className="mr-2">
              <Link to={`/channel/${comment.owner[0]._id}`}>
                <img
                  className="w-10 h-10 rounded-full"
                  src={comment.owner[0].avatar}
                  alt="avatar"
                  loading="lazy"
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
                <div className="text-xs mt-[2px] text-gray-400">
                  {timeDifference(comment.createdAt)} ago
                </div>
              </div>
              <div>{comment.content}</div>
              <div className="flex items-center">
                <span className="mr-1">{comment.likesCount}</span>
                <span
                  className="cursor-pointer"
                  onClick={() => handleToggleCommentLike(comment._id)}
                >
                  {comment.isLiked ? <BiSolidLike /> : <BiLike />}
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
  );
};

export default VideoComments;
