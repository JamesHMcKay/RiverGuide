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

interface IGuideItemProps {
    guide: IGuide;
    openInfoPage: (guide: IGuide) => void;
}

class GuideItem extends Component<IGuideItemProps, {}> {
    public handleClick = (): void => {
        this.props.openInfoPage(this.props.guide);
    }

    public render(): JSX.Element {
        return (
            <div>
                <ListItem button onClick={this.handleClick}>
                    <ListItemIcon>
                        <PlaceIcon />
                    </ListItemIcon>
                    <ListItemText inset primary={this.props.guide.title} />
                    <FlowBadge siteName={this.props.guide.gaugeName} latestFlow={this.props.guide.latestFlow} />
                </ListItem>
                <Divider />
            </div>
        );
    }
}

export default connect(
    null,
    { openInfoPage },
)(GuideItem);
