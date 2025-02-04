import axios from "axios";
import { BACKEND_URL_PREFIX } from "../constants";

const fetchChannelDetails = async (channelId, setChannel) => {
  const res = await axios.get(
    `${BACKEND_URL_PREFIX}/users/channel/${channelId}`,
    {
      withCredentials: true,
    }
  );
  if (res.data.statusCode === 200) {
    setChannel(res.data.data);
  }
};

export default fetchChannelDetails;