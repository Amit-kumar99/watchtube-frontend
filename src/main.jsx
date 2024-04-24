import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./components/Pages/Home.jsx";
import Signup from "./components/Pages/Signup.jsx";
import Login from "./components/Pages/Login.jsx";
import Watch from "./components/Pages/Watch.jsx";
import Channel from "./components/Pages/Channel.jsx";
import Videos from "./components/Pages/Videos.jsx";
import Playlists from "./components/Pages/Playlists.jsx";
import Tweets from "./components/Pages/Tweets.jsx";
import History from "./components/Pages/History.jsx";
import Comments from "./components/Pages/Comments.jsx";
import Subscribers from "./components/Pages/Subscribers.jsx";
import Subscriptions from "./components/Pages/Subscriptions.jsx";
import LikedVideos from "./components/Pages/LikedVideos.jsx";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/signin",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/watch",
        element: <Watch />,
      },
      {
        path: "/history",
        element: <History />,
      },
      {
        path: "/subscribers",
        element: <Subscribers />,
      },
      {
        path: "/subscriptions",
        element: <Subscriptions />,
      },
      {
        path: "/likedVideos",
        element: <LikedVideos />,
      },
      {
        path: "/channel/:userId",
        element: <Channel />,
        children: [
          {
            path: "/channel/:userId",
            element: <Videos />,
          },
          {
            path: "/channel/:userId/playlists",
            element: <Playlists />,
          },
          {
            path: "/channel/:userId/tweets",
            element: <Tweets />,
          },
        ],
      },
      {
        path: "/comments",
        element: <Comments />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={appRouter}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </RouterProvider>
);
