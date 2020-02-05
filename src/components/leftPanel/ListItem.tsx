import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import BarChart from "@material-ui/icons/BarChartRounded";
import Place from "@material-ui/icons/Place";
import PlaceIcon from "@material-ui/icons/PlaceOutlined";
import Pool from "@material-ui/icons/Pool";
import ShowChart from "@material-ui/icons/ShowChartRounded";
import React, { Component } from "react";
import ReactGA from "react-ga";
import { connect } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { openInfoPage, openLogInfoPage } from "../../actions/getGuides";
// import kayakerIcon from "../../img/kayakerIcon.svg";
import { IState } from "../../reducers";
import { IListEntry } from "../../utils/types";
import FlowBadge from "../common/FlowBadge";

const ACTIVITY_ICONS: Array<{id: string; icon: JSX.Element}> = [
    // {id: "kayaking", icon: <img src={kayakerIcon} alt="" className="kayaker-icon"/>},
    {id: "kayaking", icon: <Place />},
    {id: "swimming", icon: <Pool />},
    {id: "flow", icon: <ShowChart />},
    {id: "stage_height", icon: <ShowChart />},
    {id: "rainfall", icon: <BarChart />},
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
        ReactGA.event({
            category: "Navigation",
            action: "ListItemClick",
            label: this.props.guide.display_name,
        });
        this.props.openInfoPage(this.props.guide);
        this.props.openLogInfoPage(this.props.guide);
    }

    public render(): JSX.Element {
        const guide: IListEntry = this.props.guide;
        const type: string = guide.observables && guide.observables.length > 0 ? guide.observables[0].type : "";
        const iconList: Array<{id: string; icon: JSX.Element}> = ACTIVITY_ICONS.filter(
            (item: {id: string; icon: JSX.Element}) => item.id === this.props.guide.activity || item.id === type);
        const icon: JSX.Element = iconList.length > 0 ? iconList[0].icon : <PlaceIcon />;

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
                    <FlowBadge gaugeId={guide.gauge_id} observables={guide.observables} onClick={this.handleClick} />
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
