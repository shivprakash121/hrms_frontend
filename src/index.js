import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import reportWebVitals from "./reportWebVitals";
import { Provider } from "react-redux"; // Import Provider
import store from "./store/store"; // Import the Redux store

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // If you uploaded it production make sure you uncomment <React.StrictMode>
  // <React.StrictMode>
  <Provider store={store}>
    {/* Provide the store to your app */}
    <App />
  </Provider>
  //  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
