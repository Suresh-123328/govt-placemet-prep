import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

/**
 * window.storage shim
 * -----------------------------------------------------------------------
 * The app was originally built for the Claude Artifacts runtime, which
 * provides an async window.storage key-value API. Outside that runtime
 * there is no such global, so this shim reproduces the same interface
 * using the browser's built-in localStorage — meaning all progress and
 * scores persist locally in the user's own browser.
 *
 * The `shared` parameter (used for artifact multi-user data) has no
 * meaningful equivalent in a plain static deployment, so both shared
 * and personal data are stored under the same local namespace here.
 * -----------------------------------------------------------------------
 */
if (!window.storage) {
  const ns = (key) => `examprep:${key}`;

  window.storage = {
    async get(key) {
      const raw = localStorage.getItem(ns(key));
      if (raw === null) {
        throw new Error(`Key not found: ${key}`);
      }
      return { key, value: raw, shared: false };
    },

    async set(key, value) {
      localStorage.setItem(ns(key), value);
      return { key, value, shared: false };
    },

    async delete(key) {
      localStorage.removeItem(ns(key));
      return { key, deleted: true, shared: false };
    },

    async list(prefix = "") {
      const fullPrefix = ns(prefix);
      const keys = Object.keys(localStorage)
        .filter((k) => k.startsWith(fullPrefix))
        .map((k) => k.replace(/^examprep:/, ""));
      return { keys, prefix, shared: false };
    },
  };
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
