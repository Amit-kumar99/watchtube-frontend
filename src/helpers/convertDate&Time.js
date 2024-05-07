function convertToDateOnly(dateString) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const date = new Date(dateString);
  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  
  return `${month} ${day}, ${year}`;
}

function convertToTimeOnly(dateString) {
  const date = new Date(dateString);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const amOrpm = hours >= 12 ? 'PM' : 'AM';
  // Convert hours to 12-hour format
  hours = hours % 12 || 12; 
  
  return `${hours}:${minutes} ${amOrpm}`;
}


export {convertToDateOnly, convertToTimeOnly};