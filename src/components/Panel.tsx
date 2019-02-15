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
import { IState } from "../reducers/index";

import * as darksky from "dark-sky-api";
import * as weather from "openweather-apis";

import ControlBar from "./ControlBar";
import Info from "./infoPanel/Info";
import LeftPanel from "./leftPanel/LeftPanel";
import { MapComponent } from "./map/MapComponent";

import {
    IFilter,
    IGauge,
    IGuide,
    IInfoPage,
    ILatLon,
    IMapBounds } from "./../utils/types";

// Styles
import "./Panel.css";

const getDimensions = (element: any) => {
    const { width, height } = element.getBoundingClientRect();
    return { width, height };
};

export interface IMapDimensions {
    width: number;
    height: number;
}

export interface IPanelState {
    searchText: string;
    searchList: IGuide[];
    gaugeList: IGauge[];
    selectedGuide?: IGuide;
    selectedHistory: [];
    infoSelected: boolean;
    units: string;
    mapDimensions: IMapDimensions;
    searchApplied: boolean;
}

export interface IPanelProps {
    guides: IGuide[];
    gauges: IGauge[];
    infoPage: IInfoPage;
    filterdGuides: IGuide[];
    filters: IFilter[];
    makeGaugeRequest: () => void;
    makeGuideRequest: (guide: string) => void;
    setMapBounds: (mapBounds: IMapBounds) => void;
    generateFilteredList: (
        guides: IGuide[],
        filters: IFilter[],
        mapBounds: IMapBounds,
    ) => void;
    openInfoPage: (guide: IGuide) => void;
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
            mapDimensions: {
                width: 0,
                height: 0,
            },
            searchApplied: false,
        };

        weather.setAPPID("521cea2fce8675d0fe0678216dc01d5c");
        weather.setLang("en");

        darksky.units = "si";
        darksky.apiKey = "ab0e334c507c7f0de8fde5e61f27d6df";

        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.updateMapBounds = this.updateMapBounds.bind(this);
        this.closeInfo = this.closeInfo.bind(this);
        this.updateDimensions = this.updateDimensions.bind(this);
    }

    public updateDimensions() {
        const element = ReactDOM.findDOMNode(this.refs.mapView);
        this.setState({
            mapDimensions: getDimensions(element),
        });
    }

    public componentDidMount() {
        this.props.makeGaugeRequest();
        this.props.makeGuideRequest("whitewater");
        this.updateDimensions();
        window.addEventListener("resize", this.updateDimensions);
    }

    public componentWillReceiveProps(props: IPanelProps) {
        this.setState({
            searchList: props.guides,
            gaugeList: props.gauges,
        });
    }

    public searchMatchesGuide(guide: IGuide, searchText: string) {
        return (
            guide.title.toLowerCase().indexOf(searchText) > 0 ||
            guide.river.toLowerCase().indexOf(searchText) > 0 ||
            guide.region.toLowerCase().indexOf(searchText) > 0
        );
    }

    public onChange(ev: any) {
        const searchResults = this.props.guides.filter((guide) =>
            this.searchMatchesGuide(guide, ev.target.value.toLowerCase()),
        );
        let searchApplied = false;
        if (ev.target.value && ev.target.value !== "") {
            searchApplied = true;
        }
        this.setState({
            searchText: ev.target.value,
            searchList: searchResults,
            searchApplied,
        });
    }

    public closeInfo() {
        // this.setState({
        //     selectedGuide: {},
        //     selectedHistory: [],
        //     infoSelected: false
        // });
    }

    public onClick(guide: IGuide) {
        this.props.openInfoPage(guide);
    }

    public updateMapBounds = (mapBounds: IMapBounds) => {
            this.props.setMapBounds(mapBounds);
            this.props.generateFilteredList(
                this.props.guides,
                this.props.filters,
                mapBounds,
            );
    }

    public render() {
        return (
            <div className="middle-section">
                <ControlBar/>
                <div className="panel-layout">
                    <div className="left-panel">
                        <LeftPanel
                            searchList={this.state.searchList}
                            gaugeList={this.state.gaugeList}
                            gauges={this.props.gauges}
                            onClick={this.onClick}
                        />
                    </div>
                    <div className="right-panel" ref="mapView">
                        {this.props.infoPage.infoSelected ? (
                            <CSSTransition
                                classNames="slide"
                                in={this.props.infoPage.infoSelected}
                                timeout={500}
                                appear={true}
                            >
                                <Info
                                    guide={this.props.infoPage.selectedGuide}
                                />
                            </CSSTransition>
                        ) : (
                            <MapComponent
                                guides={this.props.guides || this.props.guides}
                                filteredGuides={
                                    this.props.filterdGuides ||
                                    this.props.guides
                                }
                                onClick={this.onClick}
                                mapDimensions={this.state.mapDimensions}
                                setMapBounds={this.updateMapBounds}
                            />)
                        }
                    </div>
                </div>
            </div>
        );
    }
}

Panel.propTypes = {
    makeGuideRequest: PropTypes.func.isRequired,
    makeGaugeRequest: PropTypes.func.isRequired,
    guides: PropTypes.array.isRequired,
    gauges: PropTypes.array.isRequired,
    infoPage: PropTypes.object.isRequired,
};

const mapStateToProps = (state: IState) => ({
    guides: state.guides,
    gauges: state.gauges,
    infoPage: state.infoPage,
    filterdGuides: state.filteredList,
    filters: state.filteredGuides,
});

export default connect(
    mapStateToProps,
    ({
        generateFilteredList,
        makeGaugeRequest,
        makeGuideRequest,
        setMapBounds,
        openInfoPage}),
)(Panel);
