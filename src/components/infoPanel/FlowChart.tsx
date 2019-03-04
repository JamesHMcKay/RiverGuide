
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { IState } from "../../reducers/index";
import { IHistory } from "../../utils/types";

// Material UI
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";

import Moment from "moment";

// amchart imports
import * as Am4charts from "@amcharts/amcharts4/charts";
import * as Am4core from "@amcharts/amcharts4/core";
import Am4themes_animated from "@amcharts/amcharts4/themes/animated";

// amchart theme
Am4core.useTheme(Am4themes_animated);

interface IFlowChartProps {
    history: IHistory[];

}

class FlowChart extends Component<IFlowChartProps> {

    public mapHistory = (history: IHistory[]): any[] => {
        const result: any = [];
        for (const i of history) {
            result.push({
                currentFlow: (i.data.currentFlow ? i.data.currentFlow : i.data.currentLevel),
                date: (Moment.utc(Moment(i.time, "DD/MM/YYYY h:mma")).valueOf())});
        }
        return result;
    }

    public setChartOptions = (): void => {
        const chart: any = Am4core.create("chartdiv", Am4charts.XYChart);

        chart.data = this.mapHistory(this.props.history);

        const dateAxis: any = chart.xAxes.push(new Am4charts.DateAxis());
        dateAxis.renderer.grid.template.location = 0.5;
        dateAxis.renderer.minGridDistance = 50;

        const valueAxis: any = chart.yAxes.push(new Am4charts.ValueAxis());
        valueAxis.tooltip.disabled = true;
        valueAxis.renderer.minWidth = 35;

        const series: any = chart.series.push(new Am4charts.LineSeries());
        series.dataFields.dateX = "date";
        series.dataFields.valueY = "currentFlow";
        series.strokeWidth = 3;
        series.fillOpacity = 0.5;

        dateAxis.tooltipDateFormat = "dd MMM yyyy hh:mma";
        series.tooltipText = "{valueY.value}";
        chart.cursor = new Am4charts.XYCursor();

        // Create a horizontal scrollbar range selector and place it underneath the date axis
        chart.scrollbarX = new Am4core.Scrollbar();
        chart.scrollbarX.parent = chart.bottomAxesContainer;

        // set default range to load, range starts -1 ends 1
        chart.events.on("ready", function() {
        dateAxis.zoom({start: 0.50, end: 1});
        });
    }

    public componentDidUpdate(): void {
        this.setChartOptions();

        }

    public render(): JSX.Element {
        return (
            <Card style={{width: "80%"}}>
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        Flow history
                    </Typography>
                    <div id="chartdiv" style={{ width: "100%", height: "300px"}}></div>
                </CardContent>
            </Card>
        ); }
}

FlowChart.propTypes = {
    history: PropTypes.array.isRequired,
};

function mapStateToProps(state: IState): IFlowChartProps {
    return ({
        history: state.infoPage.history,
    });
}

export default connect(mapStateToProps)(FlowChart);
