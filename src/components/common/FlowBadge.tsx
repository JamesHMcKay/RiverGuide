import { Tooltip } from "@material-ui/core";
import Chip from "@material-ui/core/Chip";
import React, { Component } from "react";
import { connect } from "react-redux";
import { IState } from "../../reducers/index";
import { dataTypeParser, unitParser } from "../../utils/dataTypeParser";
import { IGauge, IObservable, IObsValue } from "./../../utils/types";

interface IFlowBadgeProps extends IFlowBadgeStateProps {
    gaugeId?: string;
    observables?: IObservable[];
    onClick?: () => void;
}

interface IFlowBadgeStateProps {
    gauges: IGauge[];
}

class FlowBadge extends Component<IFlowBadgeProps> {
    public getObservables = (gaugeId: string | undefined): IObservable[] | undefined => {
        let observables: IObservable[] | undefined;
        if (this.props.observables) {
            observables = this.props.observables;
        } else {
            const gauges: IGauge[] = this.props.gauges.filter(
                (item: IGauge) => item.id === gaugeId,
            );
            if (gauges.length > 0) {
                observables = gauges[0].observables;
            }
        }

        if (observables && observables.length > 0) {
            const observablesFlow: IObservable[] = observables.filter(
                (item: IObservable) => item.type === "flow",
            );
            if (observablesFlow.length > 0) {
                observables = observablesFlow;
            }
        }

        return observables;
    }

    public render(): JSX.Element | null {
        let flow: string | undefined;
        let units: string | undefined;
        let type: keyof IObsValue = "flow";
        const observables: IObservable[] | undefined = this.getObservables(this.props.gaugeId);

        if (observables && observables.length > 0) {
            flow = observables[0].latest_value.toFixed(1);
            units = observables[0].units;
            type = observables[0].type;
        }

        if (flow && this.props.onClick) {
            return (
                <Tooltip title={dataTypeParser(type)}>
                    <Chip onClick={this.props.onClick} label = {flow + " " + unitParser(units)}/>
                </Tooltip>
            );
        } else if (flow) {
            return (
                <Chip label = {flow + " " + unitParser(units)}/>
            );
        } else {
            return null;
        }
    }
}

function mapStateToProps(state: IState): IFlowBadgeStateProps {
    return ({
        gauges: state.gauges,
    });
}

export default connect(
    mapStateToProps,
    {},
)(FlowBadge);
