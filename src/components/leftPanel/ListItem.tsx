import React, { Component } from "react";
import { connect } from "react-redux";
import { openInfoPage } from "../../actions/getGuides";

// Material UI
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PlaceIcon from "@material-ui/icons/PlaceOutlined";

// Components
import { IListEntry } from "../../utils/types";
import FlowBadge from "../common/FlowBadge";

interface IGuideItemProps {
    guide: IListEntry;
    openInfoPage: (guide: IListEntry) => void;
}

class GuideItem extends Component<IGuideItemProps, {}> {
    public handleClick = (): void => {
        this.props.openInfoPage(this.props.guide);
    }

    public render(): JSX.Element {
        return (
            <div>
                <ListItem button onClick={this.handleClick}>
                    <ListItemIcon style = {{marginLeft: "2em"}}>
                        <PlaceIcon />
                    </ListItemIcon>
                    <ListItemText inset primary={this.props.guide.display_name} />
                    <FlowBadge siteName={this.props.guide.gauge_id} observables={this.props.guide.observables} />
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
