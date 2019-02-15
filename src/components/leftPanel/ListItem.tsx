import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { openInfoPage } from "../../actions/actions";

// Material UI
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PlaceIcon from "@material-ui/icons/PlaceOutlined";

// Components
import { IGuide } from "../../utils/types";
import FlowBadge from "../common/FlowBadge";

import { IState } from "../../reducers/index";

interface IGuideItemProps {
    openInfoPage: (guide: IGuide) => void;
    guide: IGuide;
}

class GuideItem extends Component<IGuideItemProps, {}> {
    public handleClick = () => {
        this.props.openInfoPage(this.props.guide);
    }

    public render() {
        return (
            <div>
                <ListItem button onClick={this.handleClick}>
                    <ListItemIcon>
                        <PlaceIcon />
                    </ListItemIcon>
                    <ListItemText inset primary={this.props.guide.title} />
                    <FlowBadge siteName={this.props.guide.gaugeName} />
                </ListItem>
                <Divider />
            </div>
        );
    }
}

GuideItem.propTypes = {
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state: IState) => ({
    auth: state.auth,
});

export default connect(
    mapStateToProps,
    { openInfoPage },
)(GuideItem);
