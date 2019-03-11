
import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { IState } from "../../reducers/index";
import { IHistory, IGauge, IGuide } from "../../utils/types";

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

interface IFlowChartStateProps {
    history: IHistory[];
    gauges: IGauge[];
}

interface IFlowChartProps extends IFlowChartStateProps {
    guide: IGuide;
}

interface IChartData {
    value: string;
    date: number;
}

class FlowChart extends Component<IFlowChartProps> {

    public mapHistory = (history: IHistory[]): IChartData[] => {
        const result: IChartData[] = history.map((reading: IHistory): IChartData => {
            return {
                value: reading.data.currentFlow ? reading.data.currentFlow : reading.data.currentLevel,
                date: Moment.utc(Moment(reading.time, "DD/MM/YYYY h:mma")).valueOf(),
            };
        });
        return result;
    }

    public setChartOptions = (): void => {
        const chart: Am4charts.XYChart = Am4core.create("chartdiv", Am4charts.XYChart);

        chart.data = this.mapHistory(this.props.history);

        const dateAxis: Am4charts.DateAxis = chart.xAxes.push(new Am4charts.DateAxis());
        dateAxis.renderer.grid.template.location = 0.5;
        dateAxis.renderer.minGridDistance = 50;

        const valueAxis: Am4charts.ValueAxis = chart.yAxes.push(new Am4charts.ValueAxis());
        if (valueAxis.tooltip) {
            valueAxis.tooltip.disabled = true;
        }
        valueAxis.renderer.minWidth = 35;

        const series: Am4charts.LineSeries = chart.series.push(new Am4charts.LineSeries());
        series.dataFields.dateX = "date";
        series.dataFields.valueY = "value";
        series.strokeWidth = 3;
        series.fillOpacity = 0.5;

        dateAxis.tooltipDateFormat = "dd MMM yyyy hh:mma";
        series.tooltipText = "{valueY.value}";
        chart.cursor = new Am4charts.XYCursor();

        // Create a horizontal scrollbar range selector and place it underneath the date axis
        chart.scrollbarX = new Am4core.Scrollbar();
        chart.scrollbarX.parent = chart.bottomAxesContainer;

        // set default range to load, range starts -1 ends 1
        chart.events.on("ready", (): void => {
            dateAxis.zoom({start: 0.50, end: 1});
        });
    }


    public getLastUpdated(): JSX.Element {
        return (
            <p className="last-updated-flow">
                <em>
                    Flow Data Last Updated: {this.filterGauges()[0].lastUpdated}
                </em>
            </p>
        );
    }

    public filterGauges(): IGauge[] {
        const guide: IGuide = this.props.guide;

        if (!guide.gaugeName) {
            return [];
        }

        return this.props.gauges.filter(
            (gauge: IGauge) =>
                (this.props.guide.gaugeName && gauge.siteName.toLowerCase() ===
                this.props.guide.gaugeName.toLowerCase()),
        );
    }

    public componentDidUpdate(): void {
        this.setChartOptions();
    }

    public render(): JSX.Element {
        return (
            <Card>
                <CardContent>
                    <Typography color="textSecondary" gutterBottom>
                        Flow history
                    </Typography>
                    <div id="chartdiv" style={{width: "100%", height: "300px"}}></div>
                    {this.filterGauges().length > 0 && this.getLastUpdated()}
                </CardContent>
            </Card>
        ); }
}

FlowChart.propTypes = {
    history: PropTypes.array.isRequired,
};

function mapStateToProps(state: IState): IFlowChartStateProps {
    return ({
        history: state.infoPage.history,
        gauges: state.gauges,
    });
}

export default connect(mapStateToProps)(FlowChart);
