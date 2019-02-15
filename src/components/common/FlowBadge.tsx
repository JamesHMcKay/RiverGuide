import PropTypes from "prop-types";
import React, { Component, ReactChild } from "react";
import { connect } from "react-redux";

import { State } from "../../reducers/index";
import { IGauge } from "./../../utils/types";

// Material UI
import Chip from "@material-ui/core/Chip";

const FLOW_UNIT = " cumecs";
const HEIGHT_UNIT = " meters";

interface IFlowBadgeProps {
    gauges: IGauge[];
    siteName?: string;
}

class FlowBadge extends Component<IFlowBadgeProps> {
    constructor(props: IFlowBadgeProps) {
        super(props);
    }

    public getFlowValue = (siteName: string): string | null => {
        const gauge = this.props.gauges.filter(
            (gauge) => gauge.siteName === siteName,
        )[0];

        if (gauge) {
            return gauge.currentFlow
                ? gauge.currentFlow + FLOW_UNIT
                : gauge.currentLevel + HEIGHT_UNIT;
        }

        return null;
    }

    public render(): JSX.Element | null {
        const { siteName } = this.props;
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

const mapStateToProps = (state: State) => ({
    gauges: state.gauges,
});

export default connect(
    mapStateToProps,
    {},
)(FlowBadge);
