import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL_PREFIX } from "../../constants";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import timeDifference from "../../helpers/timeDifference";
import convertUrlToFile from "../../helpers/convertUrlToFile";
import convertDuration from "../../helpers/convertDuration";

const Videos = () => {
  const user = useSelector((store) => store.user.loggedInUserDetails);
  const { channelId } = useParams();
  const [videos, setVideos] = useState(null);
  const [showEditVideoForm, setShowEditVideoForm] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [editVideoId, setEditVideoId] = useState(null);
  const [videoDescription, setVideoDescription] = useState("");

  const fetchUserVideos = async () => {
    const res = await axios.get(
      `${BACKEND_URL_PREFIX}/videos/profile/${channelId}`,
      {
        withCredentials: true,
      }
    );
    console.log(res.data.data);
    if (res.data.statusCode === 200) {
      setVideos(res.data.data.videos);
    }
  };

  useEffect(() => {
    fetchUserVideos();
  }, []);

  const handleEditVideo = async (
    e,
    thumbnailUrl,
    title,
    description,
    videoId
  ) => {
    e.preventDefault();
    setEditVideoId(videoId);
    setThumbnailUrl(thumbnailUrl);
    setVideoTitle(title);
    setVideoDescription(description);
    setShowEditVideoForm(true);
    //coverting thumbnail url to file to pass to backend
    convertUrlToFile(thumbnailUrl, setThumbnail);
  };

  const updateVideoApi = async () => {
    if (videoTitle.trim() === "") {
      alert("video title can't be empty");
      return;
    }

    //instant UI update
    setVideos((prevVideo) =>
      prevVideo.map((video) =>
        video._id === editVideoId
          ? {
              ...video,
              thumbnail: thumbnailUrl,
              title: videoTitle,
              description: videoDescription,
            }
          : video
      )
    );

    let formData = new FormData();
    formData.append("title", videoTitle);
    formData.append("description", videoDescription);
    formData.append("thumbnail", thumbnail);
    const res = await axios.patch(
      `${BACKEND_URL_PREFIX}/videos/update/${editVideoId}`,
      formData,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (res.data.statusCode === 200) {
    }
    setShowEditVideoForm(false);
  };

  const handleDeleteVideo = async (e, videoId) => {
    e.preventDefault();
    //instant UI update
    setVideos((prevVideos) =>
      prevVideos.filter((video) => video._id !== videoId)
    );

    await axios.delete(`${BACKEND_URL_PREFIX}/videos/delete/${videoId}`, {
      withCredentials: true,
    });
  };

  const handleThumbnailChange = (e) => {
    const thumbnailFile = e.target.files[0];
    if (thumbnailFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnail(thumbnailFile);
        setThumbnailUrl(reader.result);
      };
      reader.readAsDataURL(thumbnailFile);
    }
  };

  if (!videos) {
    return "loading...";
  }

  if (videos.length === 0) {
    return "No videos available";
  }

  return (
    <div className="flex flex-wrap mb-3">
      {/* edit video form */}
      {showEditVideoForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded shadow-lg w-3/12 flex flex-col">
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={() => {
                setShowEditVideoForm(false);
                setThumbnail(null);
                setThumbnailUrl("");
              }}
            >
              Close
            </button>
            <div
              className="py-14 my-2 w-full bg-blue-300"
              style={{
                backgroundImage: `url(${thumbnailUrl})`,
                backgroundSize: "cover",
              }}
            >
              <label
                htmlFor="coverImage"
                className="relative inline-block cursor-pointer font-semibold text-white p-1 hover:bg-black rounded-md"
              >
                + Thumbnail
                <input
                  className="absolute inset-0 opacity-0"
                  type="file"
                  id="thumbnail"
                  onChange={handleThumbnailChange}
                />
              </label>
            </div>
            <input
              className="border-b outline-none focus:border-b-2 focus:border-black mb-2"
              type="text"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="Enter new video title"
            />
            <textarea
              className="border h-20"
              value={videoDescription}
              onChange={(e) => setVideoDescription(e.target.value)}
              placeholder="Enter new video description"
            />
            <button
              className="bg-lime-700 hover:bg-lime-500 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={updateVideoApi}
            >
              Save
            </button>
          </div>
        </div>
      )}
      {/* videos */}
      {videos.map((video) => (
        <Link
          to={`/watch?v=${video._id}`}
          key={video._id}
          className="border w-3/12 mr-5"
        >
          <div className="absolute bg-black text-white py-1 px-2 rounded-md">
            {convertDuration(Math.floor(video.duration))}
          </div>
          <div>
            <img
              className="w-full h-64"
              src={video.thumbnail}
              alt="thumbnail"
            />
          </div>
          <div className="font-semibold mt-1">{video.title}</div>
          <div className="flex">
            <div className="mr-1">{video.views} views .</div>
            <div>{timeDifference(video.createdAt)} ago</div>
          </div>
          <div className="text-gray-500 text-sm">{video.description}</div>
          {user._id === channelId && (
            <div className="flex justify-between mt-2">
              <button
                className="bg-lime-700 text-white font-semibold py-2 px-4"
                onClick={(e) =>
                  handleEditVideo(
                    e,
                    video.thumbnail,
                    video.title,
                    video.description,
                    video._id
                  )
                }
              >
                Edit video
              </button>
              <button
                className="bg-red-700 text-white font-semibold py-2 px-4"
                onClick={(e) => handleDeleteVideo(e, video._id)}
              >
                Delete video
              </button>
            </div>
          )}
        </Link>
      ))}
    </div>
  );
};

export default Videos;
