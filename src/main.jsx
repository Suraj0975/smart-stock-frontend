
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

// Apply the saved theme before rendering the application.
try {
  const savedTheme = localStorage.getItem("smartstock_theme");
  document.documentElement.classList.toggle(
    "dark",
    savedTheme === "dark"
  );
  document.documentElement.style.colorScheme =
    savedTheme === "dark" ? "dark" : "light";
} catch {
  document.documentElement.classList.remove("dark");
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{ duration: 3000 }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
