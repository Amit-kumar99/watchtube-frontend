import axios from "axios";
import logo from "../../../assets/watchtubeIcon.png";
import {
  BACKEND_URL_PREFIX,
  COMPANY_NAME,
  CURRENCY_TYPE,
  PREMIUM_PRICE,
} from "../../constants";
import { useSelector } from "react-redux";
import { useState } from "react";
import PremiumSuccessPopup from "../PremiumSuccessPopup";

const Premium = () => {
  const user = useSelector((store) => store.user.loggedInUserDetails);
  const [showPaymentSuccessPopup, setShowPaymentSuccessPopup] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("");

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
        setPaymentStatus("pending");
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
          setPaymentStatus("captured");
          setShowPaymentSuccessPopup(true);
          setTimeout(() => {
            window.location.href = "/";
          }, 2000);
        }
        //razorpay shows payment failure UI, therefore not included the failure scenario notification.
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
    <div className="mx-auto">
      {paymentStatus === "pending" && (
        <div className="text-blue-700 font-semibold">
          Activating your Premium access...
        </div>
      )}
      {!showPaymentSuccessPopup ? (
        <div className="flex flex-col justify-center h-screen">
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
      ) : (
        <PremiumSuccessPopup />
      )}
    </div>
  );
};

export default Premium;
