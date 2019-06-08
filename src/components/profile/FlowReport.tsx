import { isNotEmpty } from "@amcharts/amcharts4/.internal/core/utils/Utils";
import Button from "@material-ui/core/Button";
import DialogContent from "@material-ui/core/DialogContent";
import FormControl from "@material-ui/core/FormControl";
import Icon from "@material-ui/core/Icon";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import TextField from "@material-ui/core/TextField";
import InfoIcon from "@material-ui/icons/Info";
import { normalizeUnits } from "moment";
import React, { Component } from "react";
import { connect } from "react-redux";
import { getGaugeHistory } from "../../actions/actions";
import gaugeHistoryReducer from "../../reducers/gaugeHistoryReducer";
import { IState } from "../../reducers/index";
import { IGauge, IGaugeHistory, IGuide, IHistory, IListEntry, IObservable, IObsValue } from "../../utils/types";

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
    selectedGuide: IListEntry;
    date: Date;
    getGaugeHistory: (gaugeId: string | undefined) => void;
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
    type: string;
}

class FlowReport extends Component<IFlowReportProps, IFlowReportState> {
    constructor(props: IFlowReportProps) {
        super(props);

        const gauge: IGauge | undefined = this.props.gauges.filter(
            (gauge: IGauge): boolean => (gauge.id === this.props.selectedGuide.gauge_id))[0];

        this.state = {
            manualySet: false,
            unit: UNIT_OPTIONS[0],
            type: "flow",
            gauge,
        };
        if (gauge) {
            this.props.getGaugeHistory(gauge.id);
        }

    }

    public computeMean = (values: number[]): number => values.reduce(
        (a: number, b: number): number => a + b) / values.length

    public filterHistory = (item: IHistory, compareDate: Date): boolean => {
        const dateParsed: Date = new Date(item.time);
        const isSameDay: boolean = (dateParsed.getDate() === compareDate.getDate()
            && dateParsed.getMonth() === compareDate.getMonth()
            && dateParsed.getFullYear() === compareDate.getFullYear());
        return isSameDay;
    }

    public getAverageFlowForDay = (history: IHistory[]): number => {
        const date: Date = this.props.date;
        const filteredHistory: IHistory[] = history.filter(
            (item: IHistory) => this.filterHistory(item, date),
        );
        let averageFlow: number = 0;
        let averageLevel: number = 0;
        if (filteredHistory.length > 0) {

            const type: string = this.state.type;
            const key: keyof IObsValue = type as keyof IObsValue;
            const result: number[] = filteredHistory.map((reading: IHistory): number => reading.values[key] || 0);

            const flows: number[] = result;
            averageFlow = this.computeMean(flows);
            averageLevel = 0;
        }
        return averageFlow !== 0 ? averageFlow : averageLevel;
    }

    public componentDidUpdate(prevProps: IFlowReportProps): void {
        const selectedGuide: string | undefined = this.props.selectedGuide.gauge_id;
        const prevSelectedGuide: string | undefined = prevProps.selectedGuide.gauge_id;

        const shouldUpdate: boolean | undefined = selectedGuide !== prevSelectedGuide;
        if (shouldUpdate) {
            const gauge: IGauge = this.props.gauges.filter(
                (item: IGauge): boolean => (item.id === selectedGuide))[0];
            this.props.getGaugeHistory(selectedGuide);
            this.setState({
                gauge,
            });
        }
    }

    public getAvailableTypes = (): JSX.Element[] => {
        if (this.state.gauge) {
            const gauge: IGauge = this.state.gauge;
            return gauge.observables.map((item: IObservable) => (
                <MenuItem key={item.type} value={item.type}>{item.type}</MenuItem>
            ));
        }

        return [<MenuItem value="flow">
        {"flow"}
      </MenuItem>];
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

    public handleTypeChange = (event: any): void => {
        this.setState({
            type: event.target.value,
        });
    }

    public isFlowComputed = (): boolean => {
        return !this.state.manualySet;
    }

    public warningText = (): JSX.Element => {

        if (this.state.gauge && this.isFlowComputed()) {
            return (<div>{"Flow computed from average"}</div>);
        } else if (this.state.gauge) {
            return (
                <Button onClick = {(): void => this.setState({manualySet: false})}>
            {"Click here to compute flow"}
                </Button>
            );
        }
        return (<div>{"Enter flow value"}</div>);
    }

    public getUnit = (): string => {
        let unit: string = "";
        const type: string = this.state.type || "flow";
        if (this.state.gauge) {
            const observables: IObservable[] | undefined = this.state.gauge.observables;
            if (observables) {
                const selObs: IObservable[] = observables.filter((item: IObservable) => (item.type === type));
                unit = selObs[0].units;
            }
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

    public render(): JSX.Element {
        return (
            <div className = "flow-report-section">
                <div className = "flow-details-section">
                <Select
                value={this.state.type}
                onChange={this.handleTypeChange}
                input={<Input id="data-type" />}
                style={{marginRight: "3em"}}
                >
                 {this.getAvailableTypes()}
              </Select>
                {/* <TextField
                id="flow"
                type="number"
                label={this.getUnit()}
                InputLabelProps={{
                    shrink: true,
                  }}
                value={this.displayFlow()}
                onChange={this.handleChange}
                margin="normal"
                variant="outlined"
                fullWidth={false}
                /> */}
                <Input
                    id="adornment-weight"
                    value={this.displayFlow()}
                    onChange={this.handleChange}
                    endAdornment={<InputAdornment position="end">{this.getUnit()}</InputAdornment>}
                    aria-describedby="weight-helper-text"
                    inputProps={{
                        "aria-label": "Weight",
                    }}
                />
                </div>
                    {this.warningText()}
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
