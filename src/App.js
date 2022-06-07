import "./App.css";
import "antd/dist/antd.css";
import CrimeChart from "./CrimeChartComponent";
import CrimeType from "./CrimeTypeComponent";

import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function App() {
  return (
    <div>
      <h1>123</h1>
      <Router basename="/CSC3007-assignment2">
        <div>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/crimetype">Crime Type</Link>
            </li>
          </ul>

          <hr />

          <Route exact path="/" component={CrimeChart} />
          <Route path="/crimetype" component={CrimeType} />
        </div>
      </Router>
    </div>
  );
}

export default App;
