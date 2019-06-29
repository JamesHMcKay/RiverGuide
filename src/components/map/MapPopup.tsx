import React, { Component } from "react";
import { connect } from "react-redux";
import { IState } from "../../reducers/index";
import { IGauge, IListEntry } from "../../utils/types";

interface IMapPopupProps {
    guide: IListEntry;
    gauges: IGauge[];
}

class MapPopup extends Component<IMapPopupProps, {}> {

    public render(): JSX.Element {
        const { guide, gauges } = this.props;

        return (
            <div className="popup-content">
                <h5>{guide.display_name}</h5>
                {/* <FlowBadge gaugeId={guide.gauge_id} /> */}
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
