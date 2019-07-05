import Button from "@material-ui/core/Button";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import React, { Component } from "react";
import { connect } from "react-redux";
import { getGaugeHistory } from "../../actions/actions";
import { IState } from "../../reducers/index";
import { dataTypeParser, unitParser } from "../../utils/dataTypeParser";
import { IGauge, IGaugeHistory, IHistory, IListEntry, IObservable, IObsValue } from "../../utils/types";

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
    start_date: Date;
    end_date: Date;
    getGaugeHistory: (gaugeId: string | undefined) => void;
    gaugeHistoryFromInfoPage?: IHistory[];
    observables: Partial<IObsValue>;
}

interface IFlowReportStateProps {
    gauges: IGauge[];
    gaugeHistory: IGaugeHistory;
}

interface IFlowReportState {
    gauge?: IGauge;
    manualySet: boolean;
    unit: IUnitSelection;
    type: keyof IObsValue;
    flowTimeDiff: number;
}

class FlowReport extends Component<IFlowReportProps, IFlowReportState> {
    constructor(props: IFlowReportProps) {
        super(props);

        const gauge: IGauge | undefined = this.props.gauges.filter(
            (gauge: IGauge): boolean => (gauge.id === this.props.selectedGuide.gauge_id))[0];

        this.state = {
            manualySet: true,
            unit: UNIT_OPTIONS[0],
            type: "flow",
            gauge,
            flowTimeDiff: 0,
        };
        if (gauge) {
            this.props.getGaugeHistory(gauge.id);
        }

    }

    public computeMean = (values: number[]): number => values.reduce(
        (a: number, b: number): number => a + b) / values.length

    public historyToNumber = (item: IHistory): number => {
        const dateParsed: Date = new Date(item.time);
        return dateParsed.getTime();
    }

    public filterHistory = (item: IHistory, lower: number, upper: number): boolean => {
        const time: number = this.historyToNumber(item);
        return (time <= upper && time >= lower);
    }

    public roundObsValues = (values: Partial<IObsValue>): Partial<IObsValue> => {
        for (const type of Object.keys(values)) {
            const key: keyof IObsValue = type as keyof IObsValue;
            if (values[key]) {
                const value: number = values[key] || 0;
                values[key] = Math.round(value * 10) / 10;
            }
        }
        return values;
    }

    public getNearestFlow = (history: IHistory[], time: number): IHistory => {
        const historyTimes: number[] = history.map(
            (item: IHistory) => Math.abs(this.historyToNumber(item) - time),
        );
        const minDifferance: number = Math.min(...historyTimes);
        const cloestPoint: number = historyTimes.indexOf(minDifferance);
        this.setState({flowTimeDiff: minDifferance});
        return history[cloestPoint];
    }

    public getAverageFlowForDay = (history: IHistory[]): Partial<IObsValue> | null => {
        const upper: number = this.props.end_date.getTime();
        const lower: number = this.props.start_date.getTime();
        const filteredHistory: IHistory[] = history.filter(
            (item: IHistory) => this.filterHistory(item, lower, upper),
        );
        if (filteredHistory.length === 0 && history.length > 0 && this.state.gauge) {
            const midpoint: number = 0.5 * (upper + lower);
            const nearest: IHistory = this.getNearestFlow(history, midpoint);
            if (Math.abs(this.historyToNumber(nearest) - midpoint) < 2.6e8) {
                return this.roundObsValues(nearest.values);
            }
        }
        if (filteredHistory.length > 0 && this.state.gauge) {
            this.setState({flowTimeDiff: 0});
            const output: Partial<IObsValue> = filteredHistory[0].values;
            const gauge: IGauge = this.state.gauge;
            const types: string[] = gauge.observables.map((item: IObservable) => item.type);
            for (const type of types) {
                const key: keyof IObsValue = type as keyof IObsValue;
                const result: number[] = filteredHistory.map((reading: IHistory): number => reading.values[key] || 0);
                const flows: number[] = result;
                output[key] = Math.round(this.computeMean(flows) * 10) / 10;
            }
            return output;
        }
        return null;
    }

    public componentDidUpdate(prevProps: IFlowReportProps): void {
        const selectedGuide: string | undefined = this.props.selectedGuide.gauge_id;
        const prevSelectedGuide: string | undefined = prevProps.selectedGuide.gauge_id;

        const shouldUpdate: boolean | undefined = selectedGuide !== prevSelectedGuide;

        const newGaugeHistory: boolean = prevProps.gaugeHistory.gaugeHistory !== this.props.gaugeHistory.gaugeHistory;
        const newStartDate: boolean = prevProps.start_date !== this.props.start_date;
        const newEndDate: boolean = prevProps.end_date !== this.props.end_date;
        if (shouldUpdate) {
            const gauge: IGauge = this.props.gauges.filter(
                (item: IGauge): boolean => (item.id === selectedGuide))[0];
            this.props.getGaugeHistory(selectedGuide);
            this.setState({
                gauge,
            });
            this.updateFlow();
        }
        if (newGaugeHistory || newEndDate || newStartDate) {
            this.updateFlow();
        }
    }

    public getAvailableTypes = (): JSX.Element[] => {
        if (this.state.gauge) {
            const gauge: IGauge = this.state.gauge;
            return gauge.observables.map((item: IObservable) => (
                <MenuItem key={item.type} value={item.type}>
                    {dataTypeParser(item.type)}
                </MenuItem>
            ));
        }

        return [
            <MenuItem value="flow" key={"flow"}>
                {"Flow"}
            </MenuItem>,
        ];
    }

    public updateFlow = (): void => {
        const flow: Partial<IObsValue> = {flow: 0};
        this.setState({flowTimeDiff: 0});
        if (this.props.gaugeHistoryFromInfoPage && this.props.gaugeHistoryFromInfoPage.length > 0) {
            const compFlow: Partial<IObsValue> | null = this.getAverageFlowForDay(this.props.gaugeHistoryFromInfoPage);
            this.props.handleChange(compFlow ? compFlow : flow);
            this.setState({manualySet: !compFlow});
        } else if (this.props.gaugeHistory.gaugeHistory && this.props.gaugeHistory.gaugeHistory.length > 0) {
            const compFlow: Partial<IObsValue> | null = this.getAverageFlowForDay(this.props.gaugeHistory.gaugeHistory);
            this.props.handleChange(compFlow ? compFlow : flow);
            this.setState({manualySet: !compFlow});
        }
    }

    public displayFlow = (): string | undefined => {
        const result: number | undefined = this.props.observables[this.state.type];
        return result ? result.toString() : undefined;
    }

    public handleChange = (event: any): void => {
        this.setState({
            manualySet: true,
        });
        const observables: Partial<IObsValue> = this.props.observables;
        observables[this.state.type as keyof IObsValue] = parseFloat(event.target.value);
        this.props.handleChange({...observables});
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
            return (<div>{"Flow computed based on your trip date"}</div>);
        } else if (this.state.gauge && this.state.flowTimeDiff < 8.64e7) {
            return (
                <Button onClick = {(): void => {
                    this.setState({manualySet: false});
                    this.updateFlow(); }}>
            {"Click here to compute flow"}
                </Button>
            );
        } else if (this.state.gauge) {
            return (<div>{"No automatic flow calculations available for this date"}</div>);
        }
        return (<div>{"Enter flow value"}</div>);
    }

    public timeWarningText = (): JSX.Element | null => {
        if (this.state.flowTimeDiff > 8.64e7 && !this.state.manualySet) {
            return (<div>{"Computed flow is more than 24 hours from your trip date."}</div>);
        }
        return null;
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
        return unitParser(unit);
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
              {!this.state.manualySet &&
               <div>
                   {this.displayFlow() + this.getUnit()}
                   <Button onClick = {(): void => {
                    this.setState({manualySet: true}); }}>
                    {"Click to edit"}
                </Button>
                </div>
            }
            {this.state.manualySet &&
                <Input
                    id="adornment-weight"
                    value={this.displayFlow()}
                    onChange={this.handleChange}
                    endAdornment={<InputAdornment position="end">{this.getUnit()}</InputAdornment>}
                    aria-describedby="weight-helper-text"
                    inputProps={{
                        "aria-label": "Weight",
                    }}
                />}
                </div>
                    {this.warningText()}
                    {this.timeWarningText()}
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
