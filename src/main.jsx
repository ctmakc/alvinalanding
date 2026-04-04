import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

const root = document.getElementById("root");
const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

if (root?.hasChildNodes()) {
  ReactDOM.hydrateRoot(root, app);
} else if (root) {
  ReactDOM.createRoot(root).render(app);
}

requestAnimationFrame(() => {
  document.body.dataset.appReady = "true";
  document.getElementById("instant-shell")?.remove();
});
