function convertDuration(seconds) {
  if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
      return "Invalid input";
  }

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const hoursStr = hours.toString().padStart(2, '0');
  const minutesStr = minutes.toString().padStart(2, '0');
  const secondsStr = remainingSeconds.toString().padStart(2, '0');

  if (hours > 0) {
      return `${hoursStr}:${minutesStr}:${remainingSeconds}`;
  } else if (minutes > 0) {
      return `${minutesStr}:${secondsStr}`;
  } else {
      return `0:${secondsStr}`;
  }
}

export default convertDuration;