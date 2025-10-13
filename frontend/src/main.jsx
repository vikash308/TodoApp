import React from "react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router-dom"; 
import "./index.css";
import App from "./App.jsx";
import "./index.css";
import "./output.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      {" "}
      {/* ✅ Wrap App inside HashRouter */}
      <App />
    </HashRouter>
  </StrictMode>
);
