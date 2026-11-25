import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./auth.jsx";
import App from "./App.jsx";
import "./styles.css";
import { HashRouter } from 'react-router-dom'

createRoot(document.getElementById("root")).render(
  <HashRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </HashRouter>
);
