import Hidden from "@material-ui/core/Hidden";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
    closeInfoPage,
    generateFilteredList,
    setMapBounds,
} from "../actions/actions";
import { makeGaugeRequest } from "../actions/getGauges";
import {
    openInfoPage,
} from "../actions/getGuides";
import { IState } from "../reducers/index";

import Grid from "@material-ui/core/Grid";
import "mapbox-gl/dist/mapbox-gl.css";
import ReactGA from "react-ga";
import Info from "./infoPanel/Info";
import LeftPanel from "./leftPanel/LeftPanel";
import MapComponent from "./map/MapComponent";

import {
    IFilter,
    IGauge,
    IInfoPage,
    IListEntry,
    IMapBounds } from "./../utils/types";

import "./Panel.css";

export const CONTENT_HEIGHT_MOBILE: string = "67vh";
export const CONTENT_HEIGHT: string = "82vh";

export interface IPanelState {
    infoSelected: boolean;
    mapRef: any;
}

export interface IPanelMapStateToProps {
    gauges: IGauge[];
    infoPage: IInfoPage;
    filterdGuides: IListEntry[];
    listEntries: IListEntry[];
    searchPanel: string;
    filters: IFilter;
    tabIndex: string;
}

export interface IPanelProps extends IPanelMapStateToProps {
    closeInfoPage: () => void;
    makeGaugeRequest: () => void;
    setMapBounds: (mapBounds: IMapBounds) => void;
    generateFilteredList: (
        guides: IListEntry[],
        filters: IFilter,
        mapBounds: IMapBounds,
    ) => void;
    openInfoPage: (guide: IListEntry) => void;
    history: any;
}

class Panel extends Component<IPanelProps, IPanelState> {
    constructor(props: IPanelProps) {
        super(props);
        this.state = {
            infoSelected: false,
            mapRef: React.createRef(),
        };
    }

    public componentDidMount(): void {
        // this.props.makeGaugeRequest();
    }

    public onClick = (guide: IListEntry): void => {
        ReactGA.event({
            category: "Navigation",
            action: "MarkerClick",
            label: guide.display_name,
        });
        this.props.history.push(`/${this.props.tabIndex}/${guide.activity}/${guide.display_name}/${guide.id}`);
        this.props.openInfoPage(guide);
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
        return (
            <Info isLogbookInfo={false} viewHeight={viewHeight}/>
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

    public getleftPanel = (): JSX.Element => {
        return (
            <div className="left-panel">
                <LeftPanel
                    gaugeList={this.props.gauges}
                    gauges={this.props.gauges}
                    filteredList={this.props.filterdGuides}
                />
            </div>
        );
    }

    public render(): JSX.Element {
        return (
            <Grid container spacing={0} className="panel-container">
            <Hidden smDown>
                <Grid item sm={4}>
                    {this.getleftPanel()}
                </Grid>
                <Grid item sm={8}>
                    {this.props.infoPage.infoSelected ?
                        this.getInfoPage(CONTENT_HEIGHT) : this.getMapPage(CONTENT_HEIGHT)}
                </Grid>
            </Hidden>
            <Hidden mdUp>
                {this.props.infoPage.infoSelected ? this.getInfoPage("72vh") :
                    this.props.searchPanel === "list" ?
                    this.getleftPanel() : this.getMapPage(CONTENT_HEIGHT_MOBILE)}
            </Hidden>
            </Grid>
        );
    }
}

const mapStateToProps: (state: IState) => IPanelMapStateToProps = (state: IState): IPanelMapStateToProps => ({
    gauges: state.gauges,
    infoPage: state.infoPage,
    filterdGuides: state.filteredList,
    listEntries: state.listEntries,
    searchPanel: state.searchPanel,
    filters: state.filters,
    tabIndex: state.tabIndex,
});

export default connect(
    mapStateToProps,
    ({
        generateFilteredList,
        makeGaugeRequest,
        setMapBounds,
        openInfoPage,
        closeInfoPage}),
)(Panel);
