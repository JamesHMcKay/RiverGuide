import React, { Component } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

import PropTypes from 'prop-types';

import { connect } from "react-redux";
 

class FlowChart extends Component {

  //get flow data
  mapHistory = (historyData) => historyData.map((reading) =>
    reading.data.currentFlow
        ? parseFloat(reading.data.currentFlow.toString())
        : parseFloat(reading.data.currentLevel.toString()))

  
  
  //create chart options 
  createOptions(historyData){
    return {
      rangeSelector: {
        selected: 3
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
          data: this.mapHistory(historyData),
          pointStart: Date.parse("2001-02-19"), // need only start date
          pointInterval : 24 * 3600 * 1000, // one day,
        }
      ]
    }

  }
    
  
  render() {
    
    
    return (
      <div>     
        <HighchartsReact
          highcharts={Highcharts}
          constructorType={"stockChart"}
          options={this.createOptions(this.props.history)}
        />
        
      </div>
    );
  }
}

FlowChart.propTypes = {
  history: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  history: state.infoPage.history,
})

export default connect(mapStateToProps)(FlowChart);


