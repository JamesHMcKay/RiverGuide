import Hidden from "@material-ui/core/Hidden";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
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
    search_panel: string;
    mapRef: React.RefObject<MapComponent>;
}

export interface IPanelMapStateToProps {
    gauges: IGauge[];
    infoPage: IInfoPage;
    filterdGuides: IListEntry[];
    listEntries: IListEntry[];
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
            search_panel: "list",
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

    public handleToggle = (event: any, value: string): void => {
        this.setState({
            search_panel: value,
        });
    }

    public getToggleButton = (): JSX.Element => {
        return (
          <div style = {{width: "100%", height: "5vh"}}>
            <ToggleButtonGroup
                value={this.state.search_panel}
                exclusive
                onChange={this.handleToggle}
                style = {{width: "100%"}}
            >
              <ToggleButton value="list" style = {{width: "50%", height: "5vh"}}>
               List view
              </ToggleButton>
              <ToggleButton value="map" style = {{width: "50%", height: "5vh"}}>
              Map view
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        );
    }

    public getleftPanel = (viewHeight: string): JSX.Element => {
        return (
            <div className="left-panel">
                <LeftPanel
                    gaugeList={this.props.gauges}
                    gauges={this.props.gauges}
                    onClick={this.onClick}
                    filteredList={this.props.filterdGuides}
                    viewHeight={viewHeight}
                />
            </div>
        );
    }

    public render(): JSX.Element {
        return (
            <Grid container spacing={0}>
            <Hidden smDown>
            <Grid item sm={4}>
                    {this.getleftPanel(CONTENT_HEIGHT)}
                </Grid>
                <Grid item sm={8}>
                    {this.props.infoPage.infoSelected ?
                        this.getInfoPage(CONTENT_HEIGHT) : this.getMapPage(CONTENT_HEIGHT)}
                </Grid>
            </Hidden>
            <Hidden mdUp>
                {this.props.infoPage.infoSelected ? this.getInfoPage(CONTENT_HEIGHT_MOBILE) :
                    this.state.search_panel === "list" ?
                    this.getleftPanel(CONTENT_HEIGHT_MOBILE) : this.getMapPage(CONTENT_HEIGHT_MOBILE)}
            </Hidden>
            <Hidden mdUp>
                {!this.props.infoPage.infoSelected && this.getToggleButton()}
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
});

export default connect(
    mapStateToProps,
    ({
        generateFilteredList,
        makeGaugeRequest,
        setMapBounds,
        openInfoPage}),
)(Panel);
