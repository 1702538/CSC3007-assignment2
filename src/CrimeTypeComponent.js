import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import "antd/dist/antd.css";
import { Select } from "antd";
const { Option } = Select;

function CrimeTypeChart() {
  const [majorCrimeData, setMajorCrimeData] = useState([]);
  const [listOfCrimes, setListOfCrimes] = useState([]);
  const [selectedCrimeData, setSelectedCrimeData] = useState([]);
  const [previousCrimeData, setPreviousCrimeData] = useState([]);

  const svgRef = useRef();

  // URL list
  const url =
    "https://data.gov.sg/api/action/datastore_search?resource_id=83c21090-bd19-4b54-ab6b-d999c251edcf";

  // useEffect function for maintainig API data
  useEffect(() => {
    getMajorCrimeData();
  }, []);

  useEffect(() => {
    // Reset the graph
    var svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Calculate the maximum y-axis value to display
    const limit_y =
      Math.round(Math.max(...selectedCrimeData.map((o) => o.value))) * 1.1;

    // set the dimensions and margins of the graph
    var margin = { top: 30, right: 30, bottom: 70, left: 60 },
      width = 1000 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    // append the svg object to the body of the page
    var svg = d3
      .select(svgRef.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // X axis
    var x = d3
      .scaleBand()
      .range([0, width])
      .domain(
        selectedCrimeData.map(function (d) {
          return d.year;
        })
      )
      .padding(0.5);
    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Add Y axis
    var y = d3.scaleLinear().domain([0, limit_y]).range([height, 0]);
    svg.append("g").call(d3.axisLeft(y));

    svg
      .selectAll("mybar")
      .data(selectedCrimeData)
      .enter()
      .append("rect")
      .attr("fill", "#58508d")

      .attr("x", (d) => x(d.year))
      .attr("y", (d) => y(d.value))
      .attr("height", (d) => height - y(d.value))
      .attr("width", x.bandwidth());

    svg
      .selectAll("Rect")
      .on("mouseover", function (d, i) {
        d3.select("#tooltip")
          .style("opacity", 1)

          .text("In the year ")

          .append("tspan")
          .style("font-weight", "bold")
          .text(i.year)

          .append("tspan")
          .style("font-weight", "normal")
          .text(", there were ")

          .append("tspan")
          .style("font-weight", "bold")
          .text(i.value)

          .append("tspan")
          .style("font-weight", "normal")
          .text(" cases recorded for ")

          .append("tspan")
          .style("font-weight", "bold")
          .text(i.level_2);

        d3.select(this)
          .transition()
          .duration("50")
          .style("stroke", "black")
          .style("stroke-width", "1");
      })
      .on("mouseout", function (d, i) {
        d3.select("#tooltip").style("opacity", 0).text(d);
        d3.select(this)
          .transition()
          .duration("50")
          .attr("opacity", "1")
          .style("stroke-width", "0");
      });

    svg
      .append("path")
      .datum(selectedCrimeData)
      .attr("fill", "none")
      .attr("stroke", "#ff6361")
      .attr("stroke-width", 1.5)
      .attr(
        "d",
        d3
          .line()
          .x(function (d) {
            return x(d.year) + x.bandwidth() / 2;
          })
          .y(function (d) {
            return y(d.value);
          })
      );
  }, [selectedCrimeData]);

  // Axios function to retrieve API data for Serious Major Crimes
  const getMajorCrimeData = () => {
    axios.get(url).then((response) => {
      const responseRecords = response.data.result.records;
      setMajorCrimeData(responseRecords);

      console.log(responseRecords);

      const uniqueCrimeType = Array.from(
        new Set(responseRecords.map((item) => item.level_2))
      );
      setListOfCrimes(uniqueCrimeType);

      // Set default crime type selected as the first crime type listed in the API
      const firstCrimeType = responseRecords.filter((val) =>
        val.level_2.includes(uniqueCrimeType[0])
      );
      setSelectedCrimeData(firstCrimeType);

      console.log(uniqueCrimeType);
    });
  };

  // Function to update data in setSelectedYearData when user selected a different year
  function handleYearChange(event) {
    console.log(event);

    setPreviousCrimeData(selectedCrimeData);
    console.log("Previously", selectedCrimeData[0].level_2);

    var filteredData = majorCrimeData.filter(function (el) {
      return el.level_2 === event;
    });

    console.log(filteredData);

    setSelectedCrimeData(filteredData);
  }

  return (
    <div>
      <br />
      <center>
        <h2>
          Filter Cases By &nbsp;
          <Select
            onChange={handleYearChange}
            defaultValue="Murder"
            style={{
              width: 200,
            }}
          >
            {listOfCrimes.map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>
        </h2>
        <br />
        <svg ref={svgRef} width="1000px" height="500px" />
        <div id="tooltip"></div>
        <br />
        <a href="/CSC3007-assignment2">
          <b>Click here to view yearly statistics</b>
        </a>
      </center>
    </div>
  );
}

export default CrimeTypeChart;
