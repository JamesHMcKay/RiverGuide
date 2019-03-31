import Button from "@material-ui/core/Button";
import DialogContent from "@material-ui/core/DialogContent";
import FormControl from "@material-ui/core/FormControl";
import Icon from "@material-ui/core/Icon";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
import InfoIcon from "@material-ui/icons/Info";
import { normalizeUnits } from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import Select from "react-select";
import { getGaugeHistory } from "../../actions/actions";
import { IState } from "../../reducers/index";
import { IGauge, IGaugeHistory, IGuide, IHistory } from "../../utils/types";

interface IUnitSelection {
    label: string;
    value: string;
}

const UNIT_OPTIONS: IUnitSelection[] = [
    {label: "cumecs", value: "cumecs"},
    {label: "stage height (meters)", value: "meters"},
];

interface IFlowReportProps extends IFlowReportStateProps {
    handleChange: (e: any) => void;
    selectedGuide?: IGuide;
    date: Date;
    getGaugeHistory: (gauge: IGuide) => void;
    gaugeHistoryFromInfoPage?: IHistory[];
    flow?: string;
}

interface IFlowReportStateProps {
    gauges: IGauge[];
    gaugeHistory: IGaugeHistory;
}

interface IFlowReportState {
    gauge?: IGauge;
    manualySet: boolean;
    unit: IUnitSelection;
}

class FlowReport extends Component<IFlowReportProps, IFlowReportState> {
    constructor(props: IFlowReportProps) {
        super(props);

        this.state = {
            manualySet: false,
            unit: UNIT_OPTIONS[0],
        };
    }

    public computeMean = (values: number[]) => values.reduce((a, b) => a + b) / values.length;

    public filterHistory = (item: IHistory, dayNow: number, monthNow: number, yearNow: string): boolean => {
        const dateString: string = item.time;
        const day: number = parseInt(dateString.substring(0, 2));
        const month: number = parseInt(dateString.substring(3, 5)) - 1;
        const year: string = dateString.substring(6, 10);
        return (day == dayNow && month == monthNow && year == yearNow);
    }

    public getAverageFlowForDay = (history: IHistory[]): number => {
        const date: Date = this.props.date;
        const dayNow: number = parseInt(date.getDate().toString());
        const monthNow: number = date.getMonth();
        const yearNow: string = date.getFullYear().toString();
        const filteredHistory: IHistory[] = history.filter((item) => this.filterHistory(item, dayNow, monthNow, yearNow));
        let averageFlow: number = 0;
        let averageLevel: number = 0;

        if (filteredHistory.length > 0) {
            const flows: number[] = filteredHistory.map((item: IHistory): number => parseFloat(item.data.currentFlow));
            const levels: number[] = filteredHistory.map((item: IHistory): number => parseFloat(item.data.currentLevel));
            averageFlow = this.computeMean(flows);
            averageLevel = this.computeMean(levels);
        }
        return averageFlow !== 0 ? averageFlow : averageLevel;
    }

    public componentDidUpdate(prevProps: IFlowReportProps) {
        const selectedGuide: IGuide | undefined = this.props.selectedGuide;
        const prevSelectedGuide: IGuide | undefined = prevProps.selectedGuide;

        const shouldUpdate: boolean | undefined = (!!prevSelectedGuide !== !!selectedGuide) ||
            (prevSelectedGuide && selectedGuide &&
            prevSelectedGuide._id !== selectedGuide._id);
        console.log("should update = ", shouldUpdate);

        if (shouldUpdate && selectedGuide && selectedGuide.gaugeName) {
            const gaugeName: string = selectedGuide.gaugeName;
            const gauge: IGauge = this.props.gauges.filter((gauge: IGauge): boolean => (gauge.siteName == gaugeName))[0];
            this.props.getGaugeHistory(selectedGuide);
            console.log("fetching history");
            this.setState({
                gauge,
            });
        }
    }

    public displayFlow = (): string | undefined => {
        if (this.state.manualySet) {
            return this.props.flow;
        }

        let flow: number = 0;

        if (this.props.gaugeHistoryFromInfoPage && this.props.gaugeHistoryFromInfoPage.length > 0) {
            flow = this.getAverageFlowForDay(this.props.gaugeHistoryFromInfoPage);
            this.props.handleChange(flow);
        } else if (this.props.gaugeHistory.gaugeHistory && this.props.gaugeHistory.gaugeHistory.length > 0) {
            flow = this.getAverageFlowForDay(this.props.gaugeHistory.gaugeHistory);
            this.props.handleChange(flow);
        }
        return flow.toFixed(2);
    }

    public handleChange = (event: any): void => {
        this.setState({
            manualySet: true,
        });
        this.props.handleChange(event.target.value);
    }

    public handleUnitChange = (event: any): void => {
        const value: string = event.target.value;
        const unit: IUnitSelection = UNIT_OPTIONS.filter((unit) => unit.value == value)[0];
        this.setState({
            unit,
        });
    }

    public render(): JSX.Element {

        return (
            <div className = "flow-report-section">
                <div className = "flow-details-section">
                <TextField
                id="flow"
                type="number"
                label="Flow"
                InputLabelProps={{
                    shrink: true,
                  }}
                value={this.displayFlow()}
                onChange={this.handleChange}
                margin="normal"
                variant="outlined"
                fullWidth={false}
                />
                <Select
                    name="units"
                    onChange={this.handleUnitChange}
                    options={UNIT_OPTIONS}
                    value={this.state.unit}
                    fullWidth={false}
                />
                </div>
                <Button variant="contained" color="secondary">
                    Flow computed from average
                </Button>
                </div>
        );
    }
}

function mapStateToProps(state: IState): IFlowReportStateProps {
    return ({
        gauges: state.gauges,
        gaugeHistory: state.gaugeHistory,
    });
}

export default connect(
    mapStateToProps,
    {getGaugeHistory},
)(FlowReport);
