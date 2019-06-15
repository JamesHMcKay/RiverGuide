import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
    generateFilteredList,
    makeLogbookRequest,
    setMapBounds,
} from "../../actions/actions";
import {
    openLogInfoPage,
} from "../../actions/getGuides";
import { IState } from "../../reducers/index";
import { IAuth, IGauge, IInfoPage, IListEntry, ILogComplete, IMapBounds } from "../../utils/types";
import Info from "../infoPanel/Info";
import LeftPanel from "../leftPanel/LeftPanel";
import ListItemSpecial from "../leftPanel/ListItemSpecial";
import { MapComponent } from "../map/MapComponent";
import LogPage from "./LogPage";
import "./profile.css";

interface IProfileContainerState {
    infoSelected: boolean;
    search_panel: string;
    mapRef: React.RefObject<MapComponent>;
}

interface IProfileContainerProps extends IProfileContainerStateProps {
    makeLogbookRequest: (userId: string) => void;
    openLogInfoPage: (guide: IListEntry) => void;
    setMapBounds: (mapBounds: IMapBounds) => void;
    generateFilteredList: (
        guides: IListEntry[],
        filters: string,
        mapBounds: IMapBounds,
    ) => void;
}

interface IProfileContainerStateProps {
    auth: IAuth;
    gauges: IGauge[];
    infoPage: IInfoPage;
    filterdGuides: IListEntry[];
    listEntries: IListEntry[];
    log: ILogComplete[];
    logPageOpen: boolean;
}

class ProfileContainer extends Component<IProfileContainerProps, IProfileContainerState> {
    constructor(props: IProfileContainerProps) {
        super(props);
        this.state = {
            infoSelected: false,
            search_panel: "list",
            mapRef: React.createRef(),
        };
    }

    public componentDidMount(): void {
        this.props.makeLogbookRequest(this.props.auth.user.id);
    }

    public onClick = (guide: IListEntry): void => {
        this.props.openLogInfoPage(guide);
    }

    public updateMapBounds = (mapBounds: IMapBounds): void => {
            this.props.setMapBounds(mapBounds);
            this.props.generateFilteredList(
                this.props.listEntries,
                "",
                mapBounds,
            );
    }

    public getInfoPage = (): JSX.Element => {
        if (this.props.logPageOpen) {
            return (
                <LogPage/>
            );
        }
        return (
            <Info isLogbookInfo={true}/>
        );
    }

    public getMapPage = (): JSX.Element => {
        return (
                <MapComponent
                    ref={this.state.mapRef}
                    guides={this.props.listEntries}
                    filteredGuides={
                        this.props.filterdGuides ||
                        this.props.listEntries
                    }
                    onClick={this.onClick}
                    setMapBounds={this.updateMapBounds}
                />
        );
    }

    public handleToggle = (event: any, value: string): void => {
        this.setState({
            search_panel: value,
        });
    }

    public getToggleButton = (): JSX.Element => {
        return (
          <div style = {{width: "100%"}}>
            <ToggleButtonGroup value={this.state.search_panel} exclusive onChange={this.handleToggle}>
              <ToggleButton value="list" style = {{width: "50%"}}>
                <p> Search List </p>
              </ToggleButton>
              <ToggleButton value="map" style = {{width: "50%"}}>
              <p> Map </p>
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        );
    }

    public onlyUnique = (value: string, index: number, self: string[]): boolean => {
        return self.indexOf(value) === index;
    }

    public getleftPanel = (): JSX.Element => {
        const guideIdWithEntry: string[] = this.props.log.map(
            (item: ILogComplete) => item.guide_id,
        ).filter(this.onlyUnique);
        const hasLogEntry: IListEntry[] = this.props.filterdGuides.filter(
            (item: IListEntry) => guideIdWithEntry.indexOf(item.id) >= 0,
        );

        return (
            <div className="left-panel">
                <LeftPanel
                    gaugeList={this.props.gauges}
                    gauges={this.props.gauges}
                    onClick={this.onClick}
                    filteredList={hasLogEntry}
                    specialItem={<ListItemSpecial/>}
                />
            </div>
        );
    }

    public render(): JSX.Element {
        const infoOpen: boolean = this.props.infoPage.infoSelected || this.props.logPageOpen;
        return (
            <Grid container spacing={0}>
            <Hidden mdUp>
                {!infoOpen && this.getToggleButton()}
            </Hidden>
            <Hidden smDown>
            <Grid item sm={4}>
                    {this.getleftPanel()}
                </Grid>
                <Grid item sm={8}>
                    {infoOpen ? this.getInfoPage() : this.getMapPage()}
                </Grid>
            </Hidden>
            <Hidden mdUp>
                {infoOpen ? this.getInfoPage() :
                    this.state.search_panel === "list" ? this.getleftPanel() : this.getMapPage()}
            </Hidden>
            </Grid>
        );
    }

}

function mapStateToProps(state: IState): IProfileContainerStateProps {
    return ({
        auth: state.auth,
        gauges: state.gauges,
        infoPage: state.infoPage,
        filterdGuides: state.filteredList,
        listEntries: state.listEntries,
        log: state.log,
        logPageOpen: state.logPageOpen,
    });
}

export default connect(
    mapStateToProps,
    { makeLogbookRequest, openLogInfoPage, setMapBounds, generateFilteredList },
)(ProfileContainer);
