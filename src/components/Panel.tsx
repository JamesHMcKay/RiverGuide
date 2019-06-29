import Hidden from "@material-ui/core/Hidden";
import React, { Component } from "react";
// Components
import { connect } from "react-redux";
import {
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
import Info from "./infoPanel/Info";
import LeftPanel from "./leftPanel/LeftPanel";
import { MapComponent } from "./map/MapComponent";

import {
    IGauge,
    IInfoPage,
    IListEntry,
    IMapBounds } from "./../utils/types";

// Styles
import "./Panel.css";

export const CONTENT_HEIGHT_MOBILE: string = "67vh";
export const CONTENT_HEIGHT: string = "82vh";

export interface IPanelState {
    infoSelected: boolean;
    mapRef: React.RefObject<MapComponent>;
}

export interface IPanelMapStateToProps {
    gauges: IGauge[];
    infoPage: IInfoPage;
    filterdGuides: IListEntry[];
    listEntries: IListEntry[];
    searchPanel: string;
}

export interface IPanelProps extends IPanelMapStateToProps {
    makeGaugeRequest: () => void;
    setMapBounds: (mapBounds: IMapBounds) => void;
    generateFilteredList: (
        guides: IListEntry[],
        filters: string,
        mapBounds: IMapBounds,
    ) => void;
    openInfoPage: (guide: IListEntry) => void;
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
        this.props.makeGaugeRequest();
    }

    public onClick = (guide: IListEntry): void => {
        this.props.openInfoPage(guide);
    }

    public updateMapBounds = (mapBounds: IMapBounds): void => {
            this.props.setMapBounds(mapBounds);
            this.props.generateFilteredList(
                this.props.listEntries,
                "",
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
                    onClick={this.onClick}
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
});

export default connect(
    mapStateToProps,
    ({
        generateFilteredList,
        makeGaugeRequest,
        setMapBounds,
        openInfoPage}),
)(Panel);
