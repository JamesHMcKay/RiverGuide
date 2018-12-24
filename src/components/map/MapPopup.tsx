import React, { Component } from "react";
import { connect } from "react-redux";
import { GradeBadge } from "../common/GradeBadge";
import FlowBadge from "../common/FlowBadge";
import { IGuide, IGauge } from '../../utils/types';
import { State } from '../../reducers/index';

interface IMapPopupProps {
    guide: IGuide;
    gauges: IGauge[];
}

class MapPopup extends Component<IMapPopupProps, {}> {

    render() {
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

const mapStateToProps = (state: State) => ({
    gauges: state.gauges
});

export default connect(
    mapStateToProps,
    {}
)(MapPopup);
