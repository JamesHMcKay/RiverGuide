import React, { Component } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

const data = [
  0.858,
  0.912,
  0.11,
  0.6,
  1,
  0.3,
  3,
  0.8,
  0.9,
  0.4,
  0.9,
  0.7,
  0.858,
  0.912,
  0.11,
  0.6,
  1,
  0.3,
  3,
  0.8,
  0.9,
  0.4,
  0.9,
  0.7,
  0.858,
  0.912,
  0.11,
  0.6,
  1,
  0.3,
  3,
  0.8,
  0.9,
  0.4,
  0.9,
  0.7,
  0.858,
  0.912,
  0.11,
  0.6,
  1,
  0.3,
  3,
  0.8,
  0.9,
  0.4,
  0.9,
  0.7,
  0.858,
  0.912,
  0.11,
  0.6,
  1,
  0.3,
  3,
  0.8,
  0.9,
  0.4,
  0.9,
  0.7,
  0.858,
  0.912,
  0.11,
  0.6,
  1,
  0.3,
  3,
  0.8,
  0.9,
  0.4,
  0.9,
  0.7,
  0.858,
  0.912,
  0.11,
  0.6,
  1,
  0.3,
  3,
  0.8,
  0.9,
  0.4,
  0.9,
  0.7,
  0.858,
  0.912,
  0.11,
  0.6,
  1,
  0.3,
  3,
  0.8,
  0.9,
  0.4,
  0.9,
  0.7
];

let pointStart = Date.parse("2018-02-23T16:00:00+13:00");
let pointInterval = 24 * 3600 * 1000; // one day

var options = {
  rangeSelector: {
    selected: 0
  },

  title: {
    text: ""
  },
  xAxis: {
    type: "datetime",
    dateTimeLabelFormats: {
      day: "%e  %b "
    }
  },

  series: [
    {
      name: "",
      data: data,
      pointStart: pointStart,
      pointInterval: pointInterval
      // lineColor: Highcharts.getOptions().colors[1],
      // color: "blue"
    }
  ]
};

export default class FlowChart extends Component {
  render() {
    return (
      <div>
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={"stockChart"}
          options={options}
        />
      </div>
    );
  }
}
