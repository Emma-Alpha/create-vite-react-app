import { reactBridge } from "@garfish/bridge-react";
import "./index.scss";
import "./i18n/index";

import ReactDOM from "react-dom/client";
import GlobalErrorElement from "@/routes/GlobalErrorElement.tsx";

import App from "./App";

export const provider = reactBridge({
  el: "#root",
  rootComponent: App,
  errorBoundary: () => <GlobalErrorElement />,
});

if (!window.__GARFISH__) {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<App />);
}

postMessage({ payload: "removeLoading" }, "*");
