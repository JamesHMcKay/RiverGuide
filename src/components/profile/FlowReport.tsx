import Chip from "@material-ui/core/Chip";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import React, { Component } from "react";
import { connect } from "react-redux";
import { getGaugeHistory } from "../../actions/actions";
import { IState } from "../../reducers/index";
import {
  dataTypeParser,
  dataTypeToUnit,
  unitParser,
} from "../../utils/dataTypeParser";
import {
  IGauge,
  IGaugeHistory,
  IHistory,
  IHistoryNew,
  IListEntry,
  IObservable,
  IObservation,
  IObsValue,
} from "../../utils/types";

interface IUnitSelection {
  label: string;
  value: string;
}

const UNIT_OPTIONS: IUnitSelection[] = [
  { label: "cumecs", value: "cumecs" },
  { label: "stage height (meters)", value: "meters" },
  { label: "rainfall (millimetres)", value: "millimetres" },
];

interface IFlowReportProps extends IFlowReportStateProps {
  handleChange: (e: any) => void;
  selectedGuide: IListEntry;
  start_date: Date;
  end_date: Date;
  getGaugeHistory: (gaugeId: string | undefined) => void;
  gaugeHistoryFromInfoPage?: IHistoryNew;
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
      (gauge: IGauge): boolean => gauge.id === this.props.selectedGuide.gauge_id
    )[0];
    const type: keyof IObsValue = gauge ? gauge.observables[0].type : "flow";
    this.state = {
      manualySet: true,
      unit: UNIT_OPTIONS[0],
      type,
      gauge,
      flowTimeDiff: 0,
    };
    if (gauge) {
      this.props.getGaugeHistory(gauge.id);
    }
  }

  public computeMean = (values: number[]): number =>
    values.reduce((a: number, b: number): number => a + b) / values.length;

  public computeSum = (values: number[]): number =>
    values.reduce((a: number, b: number): number => a + b);

  public historyToNumber = (item: IObservation): number => {
    const dateParsed: Date = new Date(item.observation_time);
    return dateParsed.getTime();
  };

  public filterHistory = (
    item: IObservation,
    lower: number,
    upper: number
  ): boolean => {
    const time: number = this.historyToNumber(item);
    return time <= upper && time >= lower;
  };

  public roundObsValues = (
    values: Partial<IObservation>
  ): Partial<IObservation> => {
    if (values.observed_value) {
      values.observed_value = Math.round(values.observed_value * 10) / 10;
    }
    return values;
  };

  public getNearestFlow = (
    history: IObservation[],
    time: number
  ): IObservation => {
    const historyTimes: number[] = history.map((item: IObservation) =>
      Math.abs(this.historyToNumber(item) - time)
    );
    const minDifferance: number = Math.min(...historyTimes);
    const cloestPoint: number = historyTimes.indexOf(minDifferance);
    this.setState({ flowTimeDiff: minDifferance });
    return history[cloestPoint];
  };

  public getAverageFlowForDay = (
    history: IObservation[]
  ): Partial<IObservation> | null => {
    const upper: number = this.props.end_date.getTime();
    const lower: number = this.props.start_date.getTime();
    const filteredHistory: IObservation[] = history.filter(
      (item: IObservation) => this.filterHistory(item, lower, upper)
    );

    if (
      filteredHistory.length === 0 &&
      history.length > 0 &&
      this.state.gauge
    ) {
      const midpoint: number = 0.5 * (upper + lower);
      const nearest: IObservation = this.getNearestFlow(history, midpoint);
      if (Math.abs(this.historyToNumber(nearest) - midpoint) < 2.6e8) {
        return this.roundObsValues(nearest);
      }
    }
    if (filteredHistory.length > 0 && this.state.gauge) {
      this.setState({ flowTimeDiff: 0 });
      const output: Partial<IObservation> = { ...filteredHistory[0] };
      const gauge: IGauge = this.state.gauge;
      const types: string[] = gauge.observables.map(
        (item: IObservable) => item.type
      );
      for (const type of types) {
        const key: keyof IObsValue = type as keyof IObsValue;
        const result: number[] = filteredHistory.map(
          (reading: IObservation): number => reading.observed_value || 0
        );
        const flows: number[] = result;
        if (key === "rainfall") {
          let sum: number = 0;
          for (const flow of flows) {
            sum += flow;
          }
          output.observed_value = Math.round(sum * 10) / 10;
        } else {
          output.observed_value = Math.round(this.computeMean(flows) * 10) / 10;
        }
      }
      return output;
    }
    return null;
  };

  public componentDidUpdate(prevProps: IFlowReportProps): void {
    const selectedGuide: string | undefined = this.props.selectedGuide.gauge_id;
    const prevSelectedGuide: string | undefined =
      prevProps.selectedGuide.gauge_id;

    const shouldUpdate: boolean | undefined =
      selectedGuide !== prevSelectedGuide;

    const newGaugeHistory: boolean =
      prevProps.gaugeHistory.gaugeHistory !==
      this.props.gaugeHistory.gaugeHistory;
    const newStartDate: boolean =
      prevProps.start_date !== this.props.start_date;
    const newEndDate: boolean = prevProps.end_date !== this.props.end_date;
    if (shouldUpdate && !!selectedGuide) {
      const gauge: IGauge = this.props.gauges.filter(
        (item: IGauge): boolean => item.id === selectedGuide
      )[0];
      this.props.getGaugeHistory(selectedGuide);
      this.setState({
        gauge,
      });
      this.updateFlow();
    }
    if (shouldUpdate && !selectedGuide) {
      this.setState({
        manualySet: true,
        gauge: undefined,
      });
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
      <MenuItem value="stage_height" key={"stage_height"}>
        {"Stage height"}
      </MenuItem>,
    ];
  };

  public updateFlow = (): void => {
    const flow: Partial<IObservation> = { observed_value: 0 };
    this.setState({ flowTimeDiff: 0 });
    if (
      this.props.gaugeHistoryFromInfoPage &&
      this.props.gaugeHistoryFromInfoPage.flow.length > 0
    ) {
      const compFlow: Partial<IObservation> | null = this.getAverageFlowForDay(
        this.props.gaugeHistoryFromInfoPage.flow
      );
      this.props.handleChange(compFlow ? compFlow : flow);
      this.setState({ manualySet: !compFlow });
    } else if (
      this.props.gaugeHistory.gaugeHistory &&
      this.props.gaugeHistory.gaugeHistory.flow.length > 0
    ) {
      const compFlow: Partial<IObservation> | null = this.getAverageFlowForDay(
        this.props.gaugeHistory.gaugeHistory.flow
      );
      this.props.handleChange(compFlow ? compFlow : flow);
      this.setState({ manualySet: !compFlow });
    }
  };

  public displayFlow = (): string | undefined => {
    const result: number | undefined = this.props.observables[this.state.type];
    return result || result === 0 ? result.toString() : undefined;
  };

  public displayFlowNumber = (): number | undefined => {
    const result: number | undefined = this.props.observables[this.state.type];
    return result;
  };

  public handleChange = (event: any): void => {
    this.setState({
      manualySet: true,
    });
    const observables: Partial<IObsValue> = this.props.observables;
    observables[this.state.type as keyof IObsValue] = parseFloat(
      event.target.value
    );
    this.props.handleChange({ ...observables });
  };

  public handleTypeChange = (event: any): void => {
    this.setState({
      type: event.target.value,
    });
  };

  public isFlowComputed = (): boolean => {
    return !this.state.manualySet;
  };

  public warningText = (): JSX.Element => {
    if (this.state.gauge && this.isFlowComputed()) {
      return (
        <Chip
          label="Conditions calculated based on your trip date and time"
          style={{ margin: "10px" }}
          onClick={(): void => {
            this.setState({ manualySet: true });
          }}
        />
      );
    } else if (this.state.gauge && this.state.flowTimeDiff < 8.64e7) {
      return (
        <Chip
          label="Click here to compute based on your date and time"
          style={{ margin: "10px" }}
          onClick={(): void => {
            this.setState({ manualySet: false });
            this.updateFlow();
          }}
        />
      );
    } else if (this.state.gauge) {
      return <div>{"No automatic calculations available for this date"}</div>;
    }
    return <div></div>;
  };

  public timeWarningText = (): JSX.Element | null => {
    if (this.state.flowTimeDiff > 8.64e7 && !this.state.manualySet) {
      return (
        <div>
          {
            "Conditions based on data that is more than 24 hours from your date."
          }
        </div>
      );
    }
    return null;
  };

  public getUnit = (): string => {
    let unit: string = "";
    const type: string = this.state.type || "flow";
    if (this.state.gauge) {
      const observables: IObservable[] | undefined =
        this.state.gauge.observables;
      if (observables) {
        const selObs: IObservable[] = observables.filter(
          (item: IObservable) => item.type === type
        );
        unit = selObs[0].units;
      }
      return unitParser(unit);
    }
    return dataTypeToUnit(type);
  };

  public render(): JSX.Element {
    return (
      <div className="flow-report-section" style={{ justifyContent: "center" }}>
        <div className="flow-details-section">
          <Select
            value={this.state.type}
            onChange={this.handleTypeChange}
            input={<Input id="data-type" />}
            style={{ marginRight: "3em" }}
          >
            {this.getAvailableTypes()}
          </Select>
          {!this.state.manualySet && (
            <div>{this.displayFlow() + " " + this.getUnit()}</div>
          )}
          {this.state.manualySet && (
            <Input
              id="adornment-weight"
              type="number"
              value={this.displayFlowNumber()}
              onChange={this.handleChange}
              endAdornment={
                <InputAdornment position="end">{this.getUnit()}</InputAdornment>
              }
              aria-describedby="weight-helper-text"
              inputProps={{
                "aria-label": "Weight",
              }}
            />
          )}
        </div>
        {this.warningText()}
        {this.timeWarningText()}
      </div>
    );
  }
}

function mapStateToProps(state: IState): IFlowReportStateProps {
  return {
    gauges: state.gauges,
    gaugeHistory: state.gaugeHistory,
  };
}

export default connect(mapStateToProps, { getGaugeHistory })(FlowReport);
