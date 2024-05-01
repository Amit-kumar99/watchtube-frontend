import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL_PREFIX } from "../../constants";

const Comments = () => {
  const [comments, setComments] = useState([]);

  if (!localStorage.getItem("isLoggedIn")) {
    return "Please log in to see your comments";
  }

  const fetchCommentsHistory = async () => {
    const res = await axios.get(
      `${BACKEND_URL_PREFIX}/comments/commentsHistory`,
      {
        withCredentials: true,
      }
    );
    console.log(res.data.data);
    if (res.data.statusCode === 200) {
      setComments(res.data.data);
    }
  };

  useEffect(() => {
    fetchCommentsHistory();
  }, []);

  if (!comments) {
    return "loading...";
  }

  return (
    <div className="w-4/12 mx-auto">
      <h1 className="text-4xl my-5">Your Comments History</h1>
      <div className="w-full">
        {comments.map((comment) => (
          <div key={comment._id} className="border mb-5 w-full">
            <div className="bg-gray-300 p-3 rounded-lg w-full">{comment.createdAt}</div>
            <div className="flex w-full py-3">
              <div className="mr-5 w-7/12 flex flex-col justify-between">
                <div className="font-semibold">{comment.content}</div>
                <div>
                  <span>Commented on </span>
                  <span className="text-blue-500 font-semibold">{comment.video.title}</span>
                </div>
                <div>{comment.createdAt} PM/AM</div>
              </div>
              <div className="w-3/12"><img className="w-full h-20" src={comment.video.thumbnail} alt="thumbnail"/></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Comments;
