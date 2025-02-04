const convertUrlToFile = async (thumbnailUrl, setThumbnail) => {
  const res = await fetch(thumbnailUrl);
  const blob = await res.blob();
  const fileName = "thumbnail.jpg";
  const file = new File([blob], fileName);
  setThumbnail(file);
};

export default convertUrlToFile;
