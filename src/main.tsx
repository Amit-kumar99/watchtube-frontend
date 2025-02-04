import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./components/Pages/Home";
import Auth from "./components/Pages/Auth";
import Watch from "./components/Pages/Watch";
// Lazy load the Channel component
const Channel = lazy(() => import("./components/Pages/Channel"));
import Videos from "./components/Pages/Videos";
import Playlists from "./components/Pages/Playlists";
import Tweets from "./components/Pages/Tweets";
import History from "./components/Pages/History";
// Lazy load the Comments component
const Comments = lazy(() => import("./components/Pages/Comments"));
import Subscribers from "./components/Pages/Subscribers";
import Subscriptions from "./components/Pages/Subscriptions";
import LikedVideos from "./components/Pages/LikedVideos";
import { Provider } from "react-redux";
import store from "./store/store";
import Playlist from "./components/Pages/Playlist";
import CustomizeChannel from "./components/Pages/CustomizeChannel";
import PersonalDetails from "./components/Pages/PersonalDetails";
import ChangePassword from "./components/Pages/ChangePassword";
import Content from "./components/Pages/Content";
import ErrorPage from "./components/Pages/ErrorPage";
import Premium from "./components/Pages/Premium";

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
        path: "/buy-premium",
        element: <Premium />,
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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={appRouter} />
  </Provider>
);
