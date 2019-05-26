import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";

import { IState } from "../../reducers/index";
import { IGauge, IObservable } from "./../../utils/types";

interface IFlowBadgeProps extends IFlowBadgeStateProps {
    gaugeId?: string;
    observables?: IObservable[];
}

interface IFlowBadgeStateProps {
    gauges: IGauge[];
}

class FlowBadge extends Component<IFlowBadgeProps> {
    constructor(props: IFlowBadgeProps) {
        super(props);
    }

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
        const observables: IObservable[] | undefined = this.getObservables(this.props.gaugeId);

        if (observables && observables.length > 0) {
            flow = observables[0].latest_value.toFixed(1);
            units = observables[0].units;
        }
        if (units === "cumecs") {
            units = "m\u00B3/s";
        }

        if (units === "metres") {
            units = "m";
        }

        if (units === "litres_second") {
            units = "l/s";
        }

        if (flow) {
            return (
                <div>
                    {flow + " " + units}
                </div>
            );
        } else {
            return null;
        }
    }
}

FlowBadge.propTypes = {
    gauges: PropTypes.array.isRequired,
};

function mapStateToProps(state: IState): IFlowBadgeStateProps {
    return ({
        gauges: state.gauges,
    });
}

export default connect(
    mapStateToProps,
    {},
)(FlowBadge);
