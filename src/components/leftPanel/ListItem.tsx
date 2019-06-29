import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PlaceIcon from "@material-ui/icons/PlaceOutlined";
import React, { Component } from "react";
import { connect } from "react-redux";
import { openInfoPage, openLogInfoPage } from "../../actions/getGuides";

// Components
import { IListEntry } from "../../utils/types";
import FlowBadge from "../common/FlowBadge";

interface IGuideItemProps {
    guide: IListEntry;
    openInfoPage: (guide: IListEntry) => void;
    openLogInfoPage: (guide: IListEntry) => void;
}

class GuideItem extends Component<IGuideItemProps, {}> {
    public handleClick = (): void => {
        this.props.openInfoPage(this.props.guide);
        this.props.openLogInfoPage(this.props.guide);
    }

    public render(): JSX.Element {
        return (
            <div>
                <ListItem button onClick={this.handleClick}>
                    <ListItemIcon style = {{marginLeft: "1.5em"}}>
                        <PlaceIcon />
                    </ListItemIcon>
                    <ListItemText  primary={this.props.guide.display_name} />
                    <FlowBadge gaugeId={this.props.guide.gauge_id} observables={this.props.guide.observables} />
                </ListItem>
                {/* <Divider /> */}
            </div>
        );
    }
}

export default connect(
    null,
    { openInfoPage, openLogInfoPage },
)(GuideItem);
