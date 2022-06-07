import "./App.css";
import "antd/dist/antd.css";
import CrimeChart from "./CrimeChartComponent";
import CrimeTypeChart from "././CrimeTypeComponent";

import React from "react";
import { HashRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" exact element={<CrimeChart />} />
          <Route path="/crimetypechart" element={<CrimeTypeChart />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
