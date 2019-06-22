import React, { Component } from "react";
import { connect } from "react-redux";
import { IState } from "../../reducers/index";
import { IGauge, IGuide } from "../../utils/types";
import FlowBadge from "../common/FlowBadge";

interface IMapPopupProps {
    guide: IGuide;
    gauges: IGauge[];
}

class MapPopup extends Component<IMapPopupProps, {}> {

    public render(): JSX.Element {
        const { guide, gauges } = this.props;

        return (
            <div className="popup-content">
                <h5>{guide.title}</h5>
                <FlowBadge gaugeId={guide.gaugeName} />
            </div>
        );
    }
}

function mapStateToProps(state: IState): {gauges: IGauge[]} {
    return ({
        gauges: state.gauges,
    });
}

export default connect(
    mapStateToProps,
    {},
)(MapPopup);
