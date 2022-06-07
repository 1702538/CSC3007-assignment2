import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import * as d3sB from "d3-scale-break";
import "antd/dist/antd.css";
import { Select } from "antd";
const { Option } = Select;

function CrimeChart() {
  const [majorCrimeData, setMajorCrimeData] = useState([]);
  const [listOfYears, setListOfYears] = useState([]);
  const [selectedYearData, setSelectedYearData] = useState([]);
  const [previousYearData, setPreviousYearData] = useState([]);

  const svgRef = useRef();

  // URL list
  const url =
    "https://data.gov.sg/api/action/datastore_search?resource_id=83c21090-bd19-4b54-ab6b-d999c251edcf";

  // useEffect function for maintainig API data
  useEffect(() => {
    getMajorCrimeData();
  }, []);

  useEffect(() => {
    // Store previously-selected year's data
    console.log(previousYearData.length);

    // Reset the graph
    var svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Calculate the maximum x-axis value to display
    const limit_x =
      Math.round(Math.max(...selectedYearData.map((o) => o.value)) / 1000) *
      1000;

    console.log(limit_x);

    var margin = { top: 10, right: 0, bottom: 90, left: 150 },
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

    // Add X axis
    // var x = d3.scaleLinear().domain([0, 20000]).range([0, width]);

    var x = d3sB
      .scaleLinear()
      .domain([
        [0, 1000],
        [1000, 20000],
      ])
      .scope([
        [0, 0.5],
        [0.5, 1],
      ])
      .range([0, 800]);

    svg
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3sB.axisBottom(x))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");

    // Y axis
    var y = d3
      .scaleBand()
      .range([0, height])
      .domain(
        selectedYearData.map(function (d) {
          return d.level_2;
        })
      )
      .padding(0.1);

    svg.append("g").call(d3.axisLeft(y));

    svg
      .selectAll("mybar")
      .data(selectedYearData)
      .enter()
      .append("rect")
      .attr("y", (d) => y(d.level_2))
      .attr("height", y.bandwidth())
      .attr("fill", "#83BAC1");

    if (
      previousYearData.length > 0
        ? svg
            .selectAll("rect")
            .data(previousYearData)
            .attr("width", function (d) {
              return x(d.value);
            })
        : // .attr("height", y.bandwidth())
          ""
    );

    svg
      .selectAll("rect")
      .data(selectedYearData)
      .transition()
      .duration(1000)
      .attr("width", function (d) {
        return x(d.value);
      })
      .attr("height", y.bandwidth());

    d3.select("tooltip")
      .append("div")
      .attr("id", "tooltip")
      .attr("style", "position: absolute; opacity: 0;");

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
      .append("line")
      .attr("x1", 400)
      .attr("y1", 400)
      .attr("x2", 400)
      .attr("y2", 0)
      .style("stroke", "black")
      .style("stroke-dasharray", "3, 3");
  }, [selectedYearData]);

  // Axios function to retrieve API data for Serious Major Crimes
  const getMajorCrimeData = () => {
    axios.get(url).then((response) => {
      const responseRecords = response.data.result.records;
      setMajorCrimeData(responseRecords);

      // Get array of years from API
      // Store uniqueYears in state (via setListOfYears())
      const uniqueYears = Array.from(
        new Set(responseRecords.map((item) => item.year))
      );
      setListOfYears(uniqueYears);

      // Set default year selected as the earliest year in the API
      const earliestYearData = responseRecords.filter((val) =>
        val.year.includes(uniqueYears[0])
      );
      setSelectedYearData(earliestYearData);
    });
  };

  // Function to update data in setSelectedYearData when user selected a different year
  function handleYearChange(event) {
    console.log(event);

    setPreviousYearData(selectedYearData);
    console.log("Previously", selectedYearData[0].year);

    setSelectedYearData(
      majorCrimeData.filter((val) => val.year.includes(event))
    );
  }

  return (
    <div>
      <center>
        <br />
        <h2>
          <Select
            onChange={handleYearChange}
            defaultValue="2011"
            style={{
              width: 80,
            }}
          >
            {listOfYears.map((year) => (
              <Option key={year} value={year}>
                {year}
              </Option>
            ))}
          </Select>
          &nbsp;&nbsp;Cases Recorded for Selected Major Offences
        </h2>
        <br />
        <br />
        <svg ref={svgRef} width="1000px" height="450px" />
        <div id="tooltip">&nbsp;</div>
        <br />
        <a href="/CSC3007-assignment2/#/crimetypechart">
          <b>Click here to view statistics by crime type</b>
        </a>
      </center>
    </div>
  );
}

export default CrimeChart;
