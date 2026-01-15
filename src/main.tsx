/**
 * Application Entry Point
 *
 * This is where React mounts to the DOM.
 * Think of it as C#'s Main() method.
 */

import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
