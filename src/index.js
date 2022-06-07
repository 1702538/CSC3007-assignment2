import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import CrimeByType from "./CrimeTypeComponent";
import { BrowserRouter, Routes, Route, HashRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HashRouter basename="/">
      <Routes>
        <Route path="/" element={<App />}></Route>
      </Routes>
    </HashRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

// <BrowserRouter basename={process.env.PUBLIC_URL}>
//   <Routes>
//     <Route path="/" component={CrimeByType}></Route>
//     <Route path="/crimetype" component={CrimeByType}></Route>
//   </Routes>
// </BrowserRouter>;
