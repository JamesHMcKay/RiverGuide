import Grid from "@material-ui/core/Grid";
import Hidden from "@material-ui/core/Hidden";
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
import { IAuth, IFilter, IGauge, IInfoPage, IListEntry, ILogComplete, IMapBounds } from "../../utils/types";
import Info from "../infoPanel/Info";
import LeftPanel from "../leftPanel/LeftPanel";
import ListItemSpecial from "../leftPanel/ListItemSpecial";
import { MapComponent } from "../map/MapComponent";
import { CONTENT_HEIGHT, CONTENT_HEIGHT_MOBILE } from "../Panel";
import LogPage from "./LogPage";
import "./profile.css";

interface IProfileContainerState {
    infoSelected: boolean;
    mapRef: React.RefObject<MapComponent>;
}

interface IProfileContainerProps extends IProfileContainerStateProps {
    makeLogbookRequest: (userId: string) => void;
    openLogInfoPage: (guide: IListEntry) => void;
    setMapBounds: (mapBounds: IMapBounds) => void;
    generateFilteredList: (
        guides: IListEntry[],
        filters: IFilter,
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
    searchPanel: string;
    filters: IFilter;
}

class ProfileContainer extends Component<IProfileContainerProps, IProfileContainerState> {
    constructor(props: IProfileContainerProps) {
        super(props);
        this.state = {
            infoSelected: false,
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
                this.props.filters,
                mapBounds,
            );
    }

    public getInfoPage = (viewHeight: string): JSX.Element => {
        if (this.props.logPageOpen) {
            return (
                <LogPage/>
            );
        }
        return (
            <Info isLogbookInfo={true} viewHeight={viewHeight}/>
        );
    }

    public getMapPage = (viewHeight: string): JSX.Element => {
        return (
                <MapComponent
                    ref={this.state.mapRef}
                    guides={this.props.listEntries}
                    filteredGuides={
                        this.props.filterdGuides ||
                        this.props.listEntries
                    }
                    listEntries={this.props.listEntries}
                    onClick={this.onClick}
                    setMapBounds={this.updateMapBounds}
                    viewHeight={viewHeight}
                />
        );
    }

    public onlyUnique = (value: string, index: number, self: string[]): boolean => {
        return self.indexOf(value) === index;
    }

    public getleftPanel = (): JSX.Element => {
        return (
            <div className="left-panel">
                <LeftPanel
                    gaugeList={this.props.gauges}
                    gauges={this.props.gauges}
                    onClick={this.onClick}
                    filteredList={this.props.filterdGuides}
                    specialItem={<ListItemSpecial/>}
                />
            </div>
        );
    }

    public render(): JSX.Element {
        const infoOpen: boolean = this.props.infoPage.infoSelected || this.props.logPageOpen;
        return (
            <Grid container spacing={0} className="panel-container">
            <Hidden smDown>
                <Grid item sm={4}>
                    {this.getleftPanel()}
                </Grid>
                <Grid item sm={8}>
                    {infoOpen ?
                        this.getInfoPage(CONTENT_HEIGHT) : this.getMapPage(CONTENT_HEIGHT)}
                </Grid>
            </Hidden>
            <Hidden mdUp>
                {infoOpen ? this.getInfoPage("72vh") :
                    this.props.searchPanel === "list" ?
                    this.getleftPanel() : this.getMapPage(CONTENT_HEIGHT_MOBILE)}
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
        searchPanel: state.searchPanel,
        filters: state.filters,
    });
}

export default connect(
    mapStateToProps,
    { makeLogbookRequest, openLogInfoPage, setMapBounds, generateFilteredList },
)(ProfileContainer);
