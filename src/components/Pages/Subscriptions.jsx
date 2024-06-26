import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL_PREFIX } from "../../constants";
import { Link } from "react-router-dom";

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState(null);

  if (!localStorage.getItem("isLoggedIn")) {
    return "Please log in to see your subscriptions";
  }

  const fetchSubscriptions = async () => {
    const res = await axios.get(
      `${BACKEND_URL_PREFIX}/subscriptions/subscribedTo`,
      {
        withCredentials: true,
      }
    );
    setSubscriptions(res.data.data);
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  if (!subscriptions) {
    return (
      <div>
        <h1 className="text-3xl my-3">Subscribers</h1>
        loading...
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div>
        <h1 className="text-3xl my-3">Subscribers</h1>
        <h2 className="text-lg">You have no subscriptions.</h2>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl my-3">Subscriptions</h1>
      <div className="flex">
        {subscriptions.map((subscription) => (
          <Link
            to={`/channel/${subscription.channels[0]._id}`}
            className="border border-blue-700 hover:bg-blue-800 rounded-md flex py-2 px-3 items-center justify-center mr-3"
            key={subscription._id}
          >
            <div>
              <img
                className="w-10 h-10 rounded-full mr-3"
                src={subscription.channels[0].avatar}
                alt="avatar"
                loading="lazy"
              />
            </div>
            <div>{subscription.channels[0].username}</div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Subscriptions;
