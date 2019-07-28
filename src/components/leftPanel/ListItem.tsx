import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import PlaceIcon from "@material-ui/icons/PlaceOutlined";
import Pool from "@material-ui/icons/Pool";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { openInfoPage, openLogInfoPage } from "../../actions/getGuides";
import { IState } from "../../reducers";
import { IListEntry } from "../../utils/types";
import FlowBadge from "../common/FlowBadge";

const ACTIVITY_ICONS: Array<{id: string; icon: JSX.Element}> = [
    {id: "kayaking", icon: <PlaceIcon />},
    {id: "swimming", icon: <Pool />},
];

interface IGuideItemProps extends IGuideItemStateProps {
    guide: IListEntry;
    openInfoPage: (guide: IListEntry) => void;
    openLogInfoPage: (guide: IListEntry) => void;
}

interface IGuideItemStateProps {
    tabIndex: string;
}

class GuideItem extends Component<IGuideItemProps, {}> {
    public handleClick = (): void => {
        this.props.openInfoPage(this.props.guide);
        this.props.openLogInfoPage(this.props.guide);
    }

    public render(): JSX.Element {
        const iconList: Array<{id: string; icon: JSX.Element}> = ACTIVITY_ICONS.filter(
            (item: {id: string; icon: JSX.Element}) => item.id === this.props.guide.activity);
        const icon: JSX.Element = iconList.length > 0 ? iconList[0].icon : <PlaceIcon />;
        const guide: IListEntry = this.props.guide;
        return (
            <div>
                <ListItem
                    button
                    onClick={this.handleClick}
                    component={RouterLink}
                    to={`/${this.props.tabIndex}/${guide.activity}/${guide.display_name}/${guide.id}`}
                >
                    <ListItemIcon style = {{marginLeft: "1.5em"}}>
                        {icon}
                    </ListItemIcon>
                    <ListItemText  primary={guide.display_name} />
                    <FlowBadge gaugeId={guide.gauge_id} observables={guide.observables} />
                </ListItem>
                {/* <Divider /> */}
            </div>
        );
    }
}

function mapStateToProps(state: IState): IGuideItemStateProps {
    return ({
        tabIndex: state.tabIndex,
    });
}

export default connect(
    mapStateToProps,
    { openInfoPage, openLogInfoPage },
)(GuideItem);
