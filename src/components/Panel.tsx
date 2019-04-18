import Hidden from "@material-ui/core/Hidden";
import ToggleButton from "@material-ui/lab/ToggleButton";
import ToggleButtonGroup from "@material-ui/lab/ToggleButtonGroup";
import PropTypes, { string } from "prop-types";
import React, { Component } from "react";
// Components
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import { CSSTransition } from "react-transition-group";
import {
    generateFilteredList,
    makeGaugeRequest,
    makeGuideRequest,
    openInfoPage,
    setMapBounds,
} from "../actions/actions";
import { getSensorData } from "../actions/getSensorData";
import { IState } from "../reducers/index";

import * as darksky from "dark-sky-api";
import * as weather from "openweather-apis";

import Grid from "@material-ui/core/Grid";
import "mapbox-gl/dist/mapbox-gl.css";
import ControlBar from "./ControlBar";
import Info from "./infoPanel/Info";
import LeftPanel from "./leftPanel/LeftPanel";
import { MapComponent } from "./map/MapComponent";

import {
    IFeatureOfInterest,
    IFilter,
    IGauge,
    IGuide,
    IInfoPage,
    IMapBounds } from "./../utils/types";

// Styles
import "./Panel.css";

export interface IPanelState {
    searchText: string;
    searchList: IGuide[];
    gaugeList: IGauge[];
    selectedGuide?: IGuide;
    selectedHistory: [];
    infoSelected: boolean;
    units: string;
    searchApplied: boolean;
    search_panel: string;
    mapRef: React.RefObject<MapComponent>;
}

export interface IPanelMapStateToProps {
    guides: IGuide[];
    gauges: IGauge[];
    infoPage: IInfoPage;
    filterdGuides: IGuide[];
    filters: IFilter[];
    sensorFeatureList: IFeatureOfInterest[];
}

export interface IPanelProps extends IPanelMapStateToProps {
    makeGaugeRequest: () => void;
    makeGuideRequest: (guide: string) => void;
    setMapBounds: (mapBounds: IMapBounds) => void;
    generateFilteredList: (
        guides: IGuide[],
        filters: IFilter[],
        mapBounds: IMapBounds,
    ) => void;
    openInfoPage: (guide: IGuide) => void;
    getSensorData: () => void;
}

class Panel extends Component<IPanelProps, IPanelState> {
    constructor(props: IPanelProps) {
        super(props);
        this.state = {
            searchText: "",
            searchList: [],
            gaugeList: [],
            selectedHistory: [],
            infoSelected: false,
            units: "",
            searchApplied: false,
            search_panel: "list",
            mapRef: React.createRef(),
        };

        weather.setAPPID("521cea2fce8675d0fe0678216dc01d5c");
        weather.setLang("en");

        darksky.units = "si";
        darksky.apiKey = "ab0e334c507c7f0de8fde5e61f27d6df";

        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.closeInfo = this.closeInfo.bind(this);
    }

    public componentDidMount(): void {
        this.props.makeGaugeRequest();
        this.props.makeGuideRequest("whitewater");
        this.props.getSensorData();
    }

    public componentWillReceiveProps(props: IPanelProps): void {
        this.setState({
            searchList: props.guides,
            gaugeList: props.gauges,
        });
    }

    public searchMatchesGuide(guide: IGuide, searchText: string): boolean {
        return (
            guide.title.toLowerCase().indexOf(searchText) > 0 ||
            guide.river.toLowerCase().indexOf(searchText) > 0 ||
            guide.region.toLowerCase().indexOf(searchText) > 0
        );
    }

    public onChange(ev: any): void {
        const searchResults: IGuide[] = this.props.guides.filter((guide: IGuide) =>
            this.searchMatchesGuide(guide, ev.target.value.toLowerCase()),
        );
        let searchApplied: boolean = false;
        if (ev.target.value && ev.target.value !== "") {
            searchApplied = true;
        }
        this.setState({
            searchText: ev.target.value,
            searchList: searchResults,
            searchApplied,
        });
    }

    public closeInfo(): void {
        // this.setState({
        //     selectedGuide: {},
        //     selectedHistory: [],
        //     infoSelected: false
        // });
    }

    public onClick(guide: IGuide): void {
        this.props.openInfoPage(guide);
    }

    public updateMapBounds = (mapBounds: IMapBounds): void => {
            this.props.setMapBounds(mapBounds);
            this.props.generateFilteredList(
                this.props.guides,
                this.props.filters,
                mapBounds,
            );
    }

    public getInfoPage = (): JSX.Element => {
        return (
            <Info
                guide={this.props.infoPage.selectedGuide}
            />
        );
    }

    public getMapPage = (): JSX.Element => {
        return (
                <MapComponent
                    ref={this.state.mapRef}
                    guides={this.props.guides || this.props.guides}
                    filteredGuides={
                        this.props.filterdGuides ||
                        this.props.guides
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

    public getleftPanel = (): JSX.Element => {
        return (
            <div className="left-panel">
                <LeftPanel
                    searchList={this.state.searchList}
                    gaugeList={this.state.gaugeList}
                    gauges={this.props.gauges}
                    onClick={this.onClick}
                />
            </div>
        );
    }

    public render(): JSX.Element {
        return (
            <Grid container spacing={0}>
            <ControlBar/>
            <Hidden mdUp>
                {!this.props.infoPage.infoSelected && this.getToggleButton()}
            </Hidden>
            <Hidden smDown>
            <Grid item sm={4}>
                    {this.getleftPanel()}
                </Grid>
                <Grid item sm={8}>
                    {this.props.infoPage.infoSelected ? this.getInfoPage() : this.getMapPage()}
                </Grid>
            </Hidden>
            <Hidden mdUp>
                {this.props.infoPage.infoSelected ? this.getInfoPage() :
                    this.state.search_panel === "list" ? this.getleftPanel() : this.getMapPage()}
            </Hidden>
            </Grid>
        );
    }
}

const mapStateToProps: (state: IState) => IPanelMapStateToProps = (state: IState): IPanelMapStateToProps => ({
    guides: state.guides,
    gauges: state.gauges,
    infoPage: state.infoPage,
    filterdGuides: state.filteredList,
    filters: state.filteredGuides,
    sensorFeatureList: state.sensorFeatureList,
});

export default connect(
    mapStateToProps,
    ({
        generateFilteredList,
        makeGaugeRequest,
        makeGuideRequest,
        setMapBounds,
        openInfoPage,
        getSensorData}),
)(Panel);
