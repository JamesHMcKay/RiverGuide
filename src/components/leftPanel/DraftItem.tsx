import Chip from "@material-ui/core/Chip";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import BarChart from "@material-ui/icons/BarChartRounded";
// import Place from "@material-ui/icons/Place";
import PlaceIcon from "@material-ui/icons/PlaceOutlined";
import Pool from "@material-ui/icons/Pool";
import ShowChart from "@material-ui/icons/ShowChartRounded";
import React, { Component } from "react";
import ReactGA from "react-ga";
import { connect } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import { openDraftInfoPage } from "../../actions/getGuides";
import kayakerIcon from "../../img/kayakerIcon.svg";
import { IState } from "../../reducers";
import { IListEntry } from "../../utils/types";

const ACTIVITY_ICONS: Array<{id: string; icon: JSX.Element}> = [
    {id: "kayaking", icon: <img src={kayakerIcon} alt="" className="kayaker-icon"/>},
    // {id: "kayaking", icon: <Place />},
    {id: "swimming", icon: <Pool />},
    {id: "flow", icon: <ShowChart />},
    {id: "stage_height", icon: <ShowChart />},
    {id: "rainfall", icon: <BarChart />},
];

interface IDraftItemProps extends IDraftItemStateProps {
    guide: IListEntry;
    openDraftInfoPage: (guide: IListEntry) => void;
}

interface IDraftItemStateProps {
    tabIndex: string;
}

class DraftItem extends Component<IDraftItemProps, {}> {
    public handleClick = (): void => {
        ReactGA.event({
            category: "Navigation",
            action: "DraftItemClick",
            label: this.props.guide.display_name,
        });
        this.props.openDraftInfoPage(this.props.guide);
    }

    public render(): JSX.Element {
        const guide: IListEntry = this.props.guide;
        const type: string = guide.observables && guide.observables.length > 0 ? guide.observables[0].type : "";
        const iconList: Array<{id: string; icon: JSX.Element}> = ACTIVITY_ICONS.filter(
            (item: {id: string; icon: JSX.Element}) => item.id === this.props.guide.activity || item.id === type);
        const icon: JSX.Element = iconList.length > 0 ? iconList[0].icon : <PlaceIcon />;
        const status: string = guide.status ? guide.status : "Pending review";
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
                    <Chip label={status} variant="outlined" color="primary" onClick={this.handleClick}/>
                </ListItem>
                {/* <Divider /> */}
            </div>
        );
    }
}

function mapStateToProps(state: IState): IDraftItemStateProps {
    return ({
        tabIndex: state.tabIndex,
    });
}

export default connect(
    mapStateToProps,
    { openDraftInfoPage },
)(DraftItem);
