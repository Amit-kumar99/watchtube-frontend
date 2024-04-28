import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL_PREFIX } from "../../constants";

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState(null);

  if (!localStorage.getItem("isLoggedIn")) {
    return "Please log in to see your subscribers";
  }

  const fetchSubscribers = async () => {
    const res = await axios.get(
      `${BACKEND_URL_PREFIX}/subscriptions/subscribers`,
      {
        withCredentials: true,
      }
    );
    console.log(res);
    setSubscribers(res.data.data);
  };

  useEffect(() => {
    fetchSubscribers();
  }, []);

  if (!subscribers) {
    return "loading...";
  }

  return (
    <div>
      <h1 className="text-3xl my-3">Subscribers</h1>
      <div className="flex flex-wrap">
        {subscribers.map((subscriber) => (
          <div className="bg-gray-300 rounded-md flex py-2 px-3 items-center justify-center mr-2" key={subscriber._id}>
            <div><img className="w-10 h-10 rounded-full mr-3" src={subscriber.subscribers[0].avatar} alt="avatar"/></div>
            <div>{subscriber.subscribers[0].username}</div>
          </div>   
        ))}
      </div>
    </div>
  );
};

export default Subscribers;
