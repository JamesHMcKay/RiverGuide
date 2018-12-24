import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import ReactHighcharts from "react-highcharts";
import moment from "moment";

// Material UI
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

class HistoryCard extends Component {
    mapHistory = history =>
        history.map(reading => [
            moment.utc(moment(reading.time, "DD/MM/YYYY h:mma")).valueOf(),
            reading.data.currentFlow
                ? parseFloat(reading.data.currentFlow)
                : parseFloat(reading.data.currentLevel)
        ]);

    createConfig = history => ({
        chart: {
            zoomType: "x",
            height: 300
        },
        title: {
            text: ""
        },
        xAxis: {
            type: "datetime"
        },
        series: [
            {
                name: history[0].data.currentFlow ? "cumecs" : "meters",
                showInLegend: false,
                data: this.mapHistory(history),
                pointPlacement: "between",
                tooltip: {
                    valueDecimals: 1
                }
            }
        ],
        yAxis: {
            title: {
              text: 'cumecs'
            }
          },
    });

    render() {
        const { history } = this.props;

        return (
            <Card style={{width:'50%'}}>
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        Flow history
                    </Typography>
                    <br />
                    {history.length > 0 && (
                        <ReactHighcharts config={this.createConfig(history)} />
                    )}
                </CardContent>
            </Card>
        );
    }
}

HistoryCard.propTypes = {
    history: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
    history: state.infoPage.history
});

export default connect(mapStateToProps)(HistoryCard);
