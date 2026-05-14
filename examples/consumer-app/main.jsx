import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./fonts.css";

// fonts.css covers @font-face delivery only. If your license requires a tracking script
// (pc-012 in reference-fonts-implementation), add it here or in index.html—this sample does not.

const root = document.getElementById("root");
createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
