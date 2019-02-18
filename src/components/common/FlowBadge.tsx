import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";

import { IState } from "../../reducers/index";
import { IGauge } from "./../../utils/types";

// Material UI
import Chip from "@material-ui/core/Chip";

const FLOW_UNIT: string = " cumecs";
const HEIGHT_UNIT: string = " meters";

interface IFlowBadgeProps extends IFlowBadgeStateProps {
    siteName?: string;
}

interface IFlowBadgeStateProps {
    gauges: IGauge[];
}

class FlowBadge extends Component<IFlowBadgeProps> {
    constructor(props: IFlowBadgeProps) {
        super(props);
    }

    public getFlowValue = (siteName: string): string | null => {
        const gauge: IGauge = this.props.gauges.filter(
            (site: IGauge) => site.siteName === siteName,
        )[0];

        if (gauge) {
            return gauge.currentFlow
                ? gauge.currentFlow + FLOW_UNIT
                : gauge.currentLevel + HEIGHT_UNIT;
        }

        return null;
    }

    public render(): JSX.Element | null {
        const siteName: string | undefined = this.props.siteName;
        const flow: string | null | undefined = siteName && this.getFlowValue(siteName);
        if (flow) {
            return (
                <Chip
                    label={flow}
                    color="primary"
                    className="flow-badge"
                />
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
