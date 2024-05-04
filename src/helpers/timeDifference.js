const timeDifference = (createdAt) => {
  const givenTimestamp = new Date(createdAt);
  const currentTimestamp = new Date();

  const differenceInMillis = currentTimestamp - givenTimestamp;

  const seconds = Math.floor(differenceInMillis / 1000);

  // If difference is at least 1 day
  if (seconds >= 86400) {
    const days = Math.floor(seconds / (3600 * 24));
    return `${days} days`;
  } else if (seconds >= 3600) {
    // If difference is at least 1 hour
    const hours = Math.floor(seconds / 3600);
    return `${hours} hours`;
  } else if (seconds >= 60) {
    // If difference is at least 1 minute
    const minutes = Math.floor(seconds / 60);
    return `${minutes} minutes`;
  } else {
    // If difference is less than 1 minute
    return `${seconds} seconds`;
  }
};

export default timeDifference;
