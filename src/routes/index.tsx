import { createBrowserRouter } from "react-router-dom";

import { MainContentLayout } from "@/layout/MainContentLayout";
import { MainContentWrap } from "@/layout/MainContentWrap";

import GlobalErrorElement from "./GlobalErrorElement";

const router = (basename = "/") => {
  return createBrowserRouter(
    [
      {
        path: "/",
        element: <MainContentWrap />,
        errorElement: <GlobalErrorElement />,
        children: [
          {
            path: "/",
            element: <MainContentLayout />,
            children: [
              {
                index: true,
                async lazy() {
                  const { Pages } = await import("@/pages");
                  return { Component: Pages };
                },
              },
            ],
          },
        ],
      },
    ],
    {
      basename,
    },
  );
};

export default router;
