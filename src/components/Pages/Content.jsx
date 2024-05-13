import { useState } from "react";
import { BACKEND_URL_PREFIX } from "../../constants";
import axios from "axios";

const Content = () => {
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [videoFileName, setVideoFileName] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");

  if (!localStorage.getItem("isLoggedIn")) {
    return "Please log in to upload video";
  }

  const handleVideoChange = (e) => {
    setVideoFile(e.target.files[0]);
    setVideoFileName(e.target.files[0].name);
  };

  const handleThumbnailChange = (e) => {
    const thumbnail = e.target.files[0];
    if (thumbnail) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailFile(thumbnail);
        setThumbnailUrl(reader.result);
      };
      reader.readAsDataURL(thumbnail);
    }
  };

  const handleVideoUpload = async () => {
    if (!thumbnailFile || !videoFile || !videoTitle.trim()) {
      alert("video thumbnail, title, description are required");
      return;
    }

    const formData = new FormData();
    formData.append("title", videoTitle);
    formData.append("video", videoFile);
    formData.append("thumbnail", thumbnailFile);
    formData.append("description", videoDescription);

    const res = await axios.post(
      `${BACKEND_URL_PREFIX}/videos/upload`,
      formData,
      {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    if (res.data.statusCode === 200) {
      alert("video uploaded successfully");
    }
  };

  return (
    <div className="w-full mx-5">
      <form
        className="border border-gray-500 rounded-md w-4/12 mx-auto mt-10 flex flex-col p-10"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="py-7 my-2 w-full border border-blue-700">
          <label
            htmlFor="video"
            className="w-4/12 text-white ml-32 p-2 hover:bg-blue-600 cursor-pointer bg-blue-700"
          >
            Select Video
          </label>
          <input
            className="hidden"
            type="file"
            id="video"
            accept="video/*"
            onChange={handleVideoChange}
          />
          <div className="mt-5 ml-28">{videoFileName}</div>
        </div>

        <div
          className="py-20 my-2 w-full border border-blue-700"
          style={{
            backgroundImage: `url(${thumbnailUrl})`,
            backgroundSize: "cover",
          }}
        >
          <label
            htmlFor="thumbnail"
            className="w-4/12 ml-20 p-2 bg-blue-700 hover:bg-blue-600 cursor-pointer"
          >
            Choose Video Thumbnail
          </label>
          <input
            className="hidden"
            type="file"
            id="thumbnail"
            accept="image/*"
            onChange={handleThumbnailChange}
          />
        </div>

        <div>
          <input
            className="w-full p-2 outline-none my-3 bg-black bg-opacity-0 border-b"
            type="text"
            value={videoTitle}
            onChange={(e) => setVideoTitle(e.target.value)}
            placeholder="Enter video title"
          />
          <textarea
            className="w-full border p-2 h-24 bg-black bg-opacity-0"
            type="text"
            value={videoDescription}
            onChange={(e) => setVideoDescription(e.target.value)}
            placeholder="Enter video description"
          />
        </div>

        <button
          className="bg-blue-700 text-white px-4 py-2 mt-3 font-semibold"
          onClick={handleVideoUpload}
        >
          Upload Video
        </button>
      </form>
    </div>
  );
};

export default Content;
