import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";


const root = document.getElementById('root');
const isDark = true; // or from localStorage / user preference
if (isDark) document.documentElement.classList.add('dark');


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
