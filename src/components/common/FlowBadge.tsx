import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";

import { IState } from "../../reducers/index";
import { IGauge, IObservable } from "./../../utils/types";

// Material UI
import Chip from "@material-ui/core/Chip";

const FLOW_UNIT: string = " cumecs";
const HEIGHT_UNIT: string = " meters";

interface IFlowBadgeProps extends IFlowBadgeStateProps {
    siteName?: string;
    observables?: IObservable[];
}

interface IFlowBadgeStateProps {
    gauges: IGauge[];
}

class FlowBadge extends Component<IFlowBadgeProps> {
    constructor(props: IFlowBadgeProps) {
        super(props);
    }

    // public getFlowValue = (siteName?: string): string | null => {
    //     if (siteName) {
    //         const gauge: IGauge = this.props.gauges.filter(
    //             (site: IGauge) => site.siteName === siteName,
    //         )[0];

    //         if (gauge) {
    //             return gauge.currentFlow
    //                 ? gauge.currentFlow + FLOW_UNIT
    //                 : gauge.currentLevel + HEIGHT_UNIT;
    //         }
    //     } else if (this.props.latestFlow) {
    //         return this.props.latestFlow.toFixed(2).toString();
    //     }

    //     return null;
    // }

    public render(): JSX.Element | null {
        const siteName: string | undefined = this.props.siteName;
        let flow: string | undefined;
        let units: string | undefined;

        if (this.props.observables) {
            flow = this.props.observables[0].latest_value.toFixed(1);
            units = this.props.observables[0].units;
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
                // <Chip
                //     label={flow + " " + units}
                //     color="primary"
                //     className="flow-badge"
                // />
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
