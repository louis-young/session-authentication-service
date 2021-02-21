import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter as Router } from "react-router-dom";

import App from "./App";

import { AuthenticationProvider } from "./context/AuthenticationContext";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AuthenticationProvider>
        <App />
      </AuthenticationProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
