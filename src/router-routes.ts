// This file is automatically generated, do not edit.

/* eslint-disable */

import { lazy } from "solid-js";
import { type RouteDefinition } from "@solidjs/router";

const routes: RouteDefinition[] = [
  {
    path: "/",
    component: lazy(() => import("./routes/_main.tsx")),
    children: [
      {
        path: "channel/:channel",
        component: lazy(() => import("./routes/_main.channel.$channel.tsx")),
        children: [
          {
            path: "playlists",
            component: lazy(() => import("./routes/_main.channel.$channel.playlists.tsx")),
          },
          {
            path: "channels",
            component: lazy(() => import("./routes/_main.channel.$channel.channels.tsx")),
          },
          {
            path: "streams",
            component: lazy(() => import("./routes/_main.channel.$channel.streams.tsx")),
          },
          {
            path: "/",
            component: lazy(() => import("./routes/_main.channel.$channel._index.tsx")),
          },
          {
            path: "shorts",
            component: lazy(() => import("./routes/_main.channel.$channel.shorts.tsx")),
          },
        ],
      },
      {
        path: "subscriptions",
        component: lazy(() => import("./routes/_main.subscriptions.tsx")),
      },
      {
        path: "watch/:video",
        component: lazy(() => import("./routes/_main.watch.$video.tsx")),
        children: [
          {
            path: "/",
            component: lazy(() => import("./routes/_main.watch.$video._index.tsx")),
          },
        ],
      },
      {
        path: "you",
        component: lazy(() => import("./routes/_main.you._index.tsx")),
      },
      {
        path: "history",
        component: lazy(() => import("./routes/_main.history.tsx")),
      },
      {
        path: "library",
        component: lazy(() => import("./routes/_main.library.tsx")),
      },
      {
        path: "/",
        component: lazy(() => import("./routes/_main._index.tsx")),
      },
      {
        path: "search",
        component: lazy(() => import("./routes/_main.search.tsx")),
      },
    ],
  },
];

export default routes;
