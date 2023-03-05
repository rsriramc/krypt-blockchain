import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { TransactionContextProvider } from "./context/TransactionContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <TransactionContextProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </TransactionContextProvider>
);
