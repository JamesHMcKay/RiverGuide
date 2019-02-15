import moment from "moment";
import PropTypes from "prop-types";
import React, { Component } from "react";
import ReactHighcharts from "react-highcharts";
import { connect } from "react-redux";
import { State } from "../../reducers/index";
import { IHistory } from "../../utils/types";

// Material UI
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

interface IHistoryCardProps {
    history: IHistory[];
}

class HistoryCard extends Component<IHistoryCardProps> {
    public mapHistory = (history: IHistory[]) =>
        history.map((reading) =>
            (moment.utc(moment(reading.time, "DD/MM/YYYY h:mma")).valueOf(),
            reading.data.currentFlow
                ? parseFloat(reading.data.currentFlow.toString())
                : parseFloat(reading.data.currentLevel.toString())),
        )

    public createConfig = (history: IHistory[]) => ({
        chart: {
            zoomType: "x",
            height: 300,
        },
        title: {
            text: "",
        },
        xAxis: {
            type: "datetime",
        },
        series: [
            {
                name: history[0].data.currentFlow ? "cumecs" : "meters",
                showInLegend: false,
                data: this.mapHistory(history),
                pointPlacement: "between",
                tooltip: {
                    valueDecimals: 1,
                },
            },
        ],
        yAxis: {
            title: {
              text: "cumecs",
            },
          },
    })

    public render() {
        const { history } = this.props;

        return (
            <Card style={{width: "50%"}}>
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
    history: PropTypes.array.isRequired,
};

const mapStateToProps = (state: State) => ({
    history: state.infoPage.history,
});

export default connect(mapStateToProps)(HistoryCard);
