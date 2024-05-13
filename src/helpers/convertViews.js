const convertViews = (viewsCount) => {
  const viewsInK = viewsCount/1000;
  if (viewsCount >= 1000) {
    return viewsInK.toFixed(1) + "k";
  }
  return viewsCount;
}

export default convertViews;