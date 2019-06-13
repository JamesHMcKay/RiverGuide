
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import React, { Component } from "react";
import { connect } from "react-redux";
import { IState } from "../../reducers/index";
import { IGauge, IHistory, IInfoPage, IObservable, IObsValue } from "../../utils/types";

// Material UI
import Typography from "@material-ui/core/Typography";

import Moment from "moment";

// amchart imports
import * as Am4charts from "@amcharts/amcharts4/charts";
import * as Am4core from "@amcharts/amcharts4/core";
import Am4themes_animated from "@amcharts/amcharts4/themes/animated";
import DataDropDown from "./DataDropDown";

// amchart theme
Am4core.useTheme(Am4themes_animated);

interface IFlowChartStateProps {
    infoPage: IInfoPage;
    gauges: IGauge[];
}

interface IFlowChartProps extends IFlowChartStateProps {
    gaugeId: string;
}

interface IChartData {
    value: number;
    date: number;
}

interface IFlowChartState {
    selectedType?: string;
}

class FlowChart extends Component<IFlowChartProps, IFlowChartState> {
    constructor(props: IFlowChartProps) {
        super(props);
        let selectedType: string | undefined;
        const observables: IObservable[] | undefined = this.getObservables();
        if (observables) {
            const types: string[] = observables.map((item: IObservable): string => item.type);
            if (types.indexOf("flow") >= 0) {
                selectedType = "flow";
            } else if (types.length > 0) {
                selectedType = types[0];
            }
        }
        this.state = {
            selectedType,
        };
      }

    public getObservables = (): IObservable[] | undefined => {
        const observables: IObservable[] | undefined = this.props.infoPage.selectedGuide.observables;
        if (observables) {
            return observables;
        } else {
            const gauges: IGauge[] = this.props.gauges.filter(
                (item: IGauge) => item.id === this.props.infoPage.selectedGuide.gauge_id,
            );
            if (gauges.length > 0) {
                return gauges[0].observables;
            }
        }
        return undefined;
    }

    public mapHistory = (history: IHistory[]): IChartData[] => {
        const type: string = this.state.selectedType || "flow";
        const key: keyof IObsValue = type as keyof IObsValue;
        const result: IChartData[] = history.map((reading: IHistory): IChartData => {
            return {
                value: reading.values[key] || 0,
                date: Moment.utc(Moment(reading.time)).valueOf(),
            };
        });
        return result;
    }

    public getUnit = (): string => {
        let unit: string = "";
        const type: string = this.state.selectedType || "flow";
        const observables: IObservable[] | undefined = this.getObservables();
        if (observables) {
            const selObs: IObservable[] = observables.filter((item: IObservable) => (item.type === type));
            unit = selObs[0].units;
        }
        if (unit === "cumecs") {
            unit = "m\u00B3/s";
        }

        if (unit === "metres") {
            unit = "m";
        }

        if (unit === "litres_second") {
            unit = "l/s";
        }
        return unit;
    }

    public setChartOptions = (): void => {
        const chart: Am4charts.XYChart = Am4core.create("chartdiv", Am4charts.XYChart);

        chart.data = this.mapHistory(this.props.infoPage.history);
        const dateAxis: Am4charts.DateAxis = chart.xAxes.push(new Am4charts.DateAxis());
        // dateAxis.renderer.grid.template.location = 0.5;
        // dateAxis.renderer.minGridDistance = 50;
        dateAxis.baseInterval = {
            timeUnit: "minute",
            count: 1,
        };

        const valueAxis: Am4charts.ValueAxis = chart.yAxes.push(new Am4charts.ValueAxis());
        if (valueAxis.tooltip) {
            valueAxis.tooltip.disabled = true;
        }
        valueAxis.title.text = this.getUnit();
        // valueAxis.renderer.minWidth = 35;

        const series: Am4charts.LineSeries = chart.series.push(new Am4charts.LineSeries());
        series.dataFields.dateX = "date";
        series.dataFields.valueY = "value";
        series.strokeWidth = 3;
        series.fillOpacity = 0.0;

        dateAxis.tooltipDateFormat = "dd MMM yyyy hh:mma";
        series.tooltipText = "{valueY.value}";
        chart.cursor = new Am4charts.XYCursor();

        // Create a horizontal scrollbar range selector and place it underneath the date axis
        chart.scrollbarX = new Am4core.Scrollbar();
        chart.scrollbarX.parent = chart.bottomAxesContainer;

        // set default range to load, range starts -1 ends 1
        // chart.events.on("ready", (): void => {
        //     dateAxis.zoom({start: 0.50, end: 1});
        // });
    }

    // public getLastUpdated(): JSX.Element {
    //     return (
    //         <p className="last-updated-flow">
    //             <em>
    //                 Flow Data Last Updated: {this.filterGauges()[0].lastUpdated}
    //             </em>
    //         </p>
    //     );
    // }

    public componentDidUpdate(): void {
        this.setChartOptions();
    }

    public selectTypeClick(type: string): void {
        this.setState({
            selectedType: type,
        });
    }

    public getButtonColor(type: string): "inherit" | "primary" | "secondary" | "default" | undefined {
        if (type === this.state.selectedType) {
            return "primary";
        }
        return "default";
    }

    public getButtonVariant(type: string):
        "text" | "outlined" | "contained" | undefined {
        if (type === this.state.selectedType) {
            return "contained";
        }
        return "outlined";
    }

    public getButtons = (): JSX.Element[] | null => {
        const observables: IObservable[] | undefined = this.getObservables();
        if (observables) {
            const result: JSX.Element[] = observables.map((item: IObservable) =>
                <Button
                    style = {{marginLeft: "10px"}}
                    variant={this.getButtonVariant(item.type)}
                    color={this.getButtonColor(item.type)} key={item.type}
                    onClick = {(): void => this.selectTypeClick(item.type)}
                >
                    {item.type}
                </Button>);
            result.push(<DataDropDown key = "data-drop-down"/>);
            return result;
        } else {
            return null;
        }
    }

    public render(): JSX.Element {
        return (
            // <Card>
                <Grid container item xs={12} spacing={10} justify="space-between">

                <Grid container item md={6} lg={6} justify="flex-start">
                    <Typography variant="h5" gutterBottom>
                        Data
                    </Typography>
                </Grid>

                <Grid container item md={6} lg={6} justify="flex-end">
                    <div className="flow-chart-buttons">
                        {this.getButtons()}
                    </div>
                </Grid>

                    <Grid container item md={12} lg={12} justify="center">
                    <div id="chartdiv" style={{width: "100%", height: "300px"}}></div>
                    {/* {this.filterGauges().length > 0 && this.getLastUpdated()} */}
                    </Grid>
                {/* </CardContent> */}
                </Grid>
            // </Card>
        ); }
}

function mapStateToProps(state: IState): IFlowChartStateProps {
    return ({
        infoPage: state.infoPage,
        gauges: state.gauges,
    });
}

export default connect(mapStateToProps)(FlowChart);
