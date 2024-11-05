import axios from "axios";
import logo from "../../../assets/watchtubeIcon.png";
import {
  BACKEND_URL_PREFIX,
  COMPANY_NAME,
  CURRENCY_TYPE,
  PREMIUM_PRICE,
} from "../../constants";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Premium = () => {
  const navigate = useNavigate();

  const user = useSelector((store) => store.user.loggedInUserDetails);

  if (!localStorage.getItem("isLoggedIn")) {
    return "Please log in to buy premium";
  }

  const handlePayment = async () => {
    // Fetches the order ID from my server
    const order = await axios.post(
      `${BACKEND_URL_PREFIX}/payments/createOrder`,
      {
        amount: PREMIUM_PRICE,
      },
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Set up Razorpay options
    const options = {
      key_id: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.data.data.amount,
      currency: CURRENCY_TYPE,
      name: COMPANY_NAME,
      description: "Test Transaction",
      order_id: order.data.data.id,
      handler: async function (response) {
        // Send payment confirmation to the backend
        const res = await axios.post(
          `${BACKEND_URL_PREFIX}/payments/confirmPayment`,
          {
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            userId: user?._id,
          },
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (res.data.statusCode === 200) {
          alert("1 month Premium bought");
          navigate("/");
        } else {
          alert("Transaction failed. Please try again");
        }
      },
      prefill: {
        name: user?.fullName,
        email: user?.email,
      },
      theme: {
        color: "#3399cc",
      },
    };

    // Open Razorpay checkout
    const razorpayObject = new Razorpay(options);
    razorpayObject.open();
  };

  return (
    <div className="mx-auto flex flex-col justify-center h-screen">
      <div className="mx-auto mb-10 text-3xl font-semibold">
        <img
          className="w-10 h-10 inline-block mr-2 mb-1"
          src={logo}
          alt="watchtube-logo"
        />
        <span>Watchtube Premium</span>
      </div>
      <div className="mx-auto mb-5 text-5xl font-bold">All WatchTube.</div>
      <div className="mx-auto mb-10 text-5xl font-bold">No Ads.</div>
      <button
        className="mx-auto border-4 border-black text-lg font-semibold p-3 hover:bg-black"
        onClick={handlePayment}
      >
        Buy Premium
      </button>
    </div>
  );
};

export default Premium;
