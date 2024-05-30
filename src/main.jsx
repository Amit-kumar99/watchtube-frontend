import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./components/Pages/Home.jsx";
import Auth from "./components/Pages/Auth.jsx";
import Watch from "./components/Pages/Watch.jsx";
// Lazy load the Channel component
const Channel = lazy(() => import("./components/Pages/Channel.jsx"));
import Videos from "./components/Pages/Videos.jsx";
import Playlists from "./components/Pages/Playlists.jsx";
import Tweets from "./components/Pages/Tweets.jsx";
import History from "./components/Pages/History.jsx";
// Lazy load the Comments component
const Comments = lazy(() => import("./components/Pages/Comments.jsx"));
import Subscribers from "./components/Pages/Subscribers.jsx";
import Subscriptions from "./components/Pages/Subscriptions.jsx";
import LikedVideos from "./components/Pages/LikedVideos.jsx";
import { Provider } from "react-redux";
import store from "./store/store.js";
import Playlist from "./components/Pages/Playlist.jsx";
import CustomizeChannel from "./components/Pages/CustomizeChannel.jsx";
import PersonalDetails from "./components/Pages/PersonalDetails.jsx";
import ChangePassword from "./components/Pages/ChangePassword.jsx";
import Content from "./components/Pages/Content.jsx";
import ErrorPage from "./components/Pages/ErrorPage.jsx";

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/auth",
        element: <Auth />,
      },
      {
        path: "/content",
        element: <Content />,
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
        path: "/channel/:channelId",
        element: (
          <Suspense fallback={<div>Loading Channel...</div>}>
            <Channel />
          </Suspense>
        ),
        children: [
          {
            path: "/channel/:channelId",
            element: <Videos />,
          },
          {
            path: "playlists",
            element: <Playlists />,
          },
          {
            path: "tweets",
            element: <Tweets />,
          },
        ],
      },
      {
        path: "/channel/edit",
        element: <CustomizeChannel />,
        children: [
          {
            path: "personalDetails",
            element: <PersonalDetails />,
          },
          {
            path: "changePassword",
            element: <ChangePassword />,
          },
        ],
      },
      {
        path: "/playlist/:playlistId",
        element: <Playlist />,
      },
      {
        path: "/comments",
        element: (
          <Suspense fallback={<div>Loading Comments...</div>}>
            <Comments />
          </Suspense>
        ),
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={appRouter}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </RouterProvider>
  </Provider>
);
