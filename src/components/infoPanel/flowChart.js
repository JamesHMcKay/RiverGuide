import React, { Component } from "react";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

import PropTypes from 'prop-types';

import { connect } from "react-redux";
 
// Material UI
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

class FlowChart extends Component {

  //get flow data
  mapHistory = (historyData) => historyData.map((reading) =>
    reading.data.currentFlow
        ? parseFloat(reading.data.currentFlow.toString())
        : parseFloat(reading.data.currentLevel.toString()))

  getDate(history){
    let result = console.log(history.map((reading) =>
    reading.time))
    result !== undefined? console.log(result[0]) : console.log("not loaded")
  }
  
  //create chart options 
  createOptions(historyData){

    return {
          
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
          //pointStart: this.getDate(historyData),
          pointInterval : 24 * 3600 * 1000, // one day,
        }
      ]
    }

  }
    
  
  render() {
    const { history } = this.props;
    
    return (
      <Card style={{width: "50%" }}>
      <CardContent>
          <Typography color="textSecondary" gutterBottom>
              Flow history
          </Typography>
          <HighchartsReact
          highcharts={Highcharts}
          constructorType={"stockChart"}
          options={this.createOptions(this.props.history) }
        />
      
      </CardContent>
    </Card>
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


