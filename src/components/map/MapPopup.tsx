import React, { Component } from "react";
import { connect } from "react-redux";
import { IState } from "../../reducers/index";
import { IGauge, IGuide } from "../../utils/types";
import FlowBadge from "../common/FlowBadge";
import { GradeBadge } from "../common/GradeBadge";

interface IMapPopupProps {
    guide: IGuide;
    gauges: IGauge[];
}

class MapPopup extends Component<IMapPopupProps, {}> {

    public render() {
        const { guide, gauges } = this.props;

        return (
            <div className="popup-content">
                <h5>{guide.title}</h5>
                <GradeBadge guide={guide} gauges={gauges} />
                <FlowBadge siteName={guide.gaugeName} />
            </div>
        );
    }
}

const mapStateToProps = (state: IState) => ({
    gauges: state.gauges,
});

export default connect(
    mapStateToProps,
    {},
)(MapPopup);
