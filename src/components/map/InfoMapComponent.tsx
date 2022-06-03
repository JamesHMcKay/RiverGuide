import Warning from "@material-ui/icons/Warning";
import React, { Component } from "react";
import ReactMapGL, { Marker, NavigationControl } from "react-map-gl";
import { connect } from "react-redux";
import uuid from "uuidv4";
import { IState } from "../../reducers";
import { IGauge, IInfoPage, IMarker } from "../../utils/types";
import MapMarker from "./MapMarker";
import TileSelector from "./TileSelector";
import ViewMarkerModal from "./ViewMarkerModal";

const TOKEN: string = process.env.REACT_APP_MAPBOX_TOKEN || "";

interface IInfoMapStateProps {
    infoPage: IInfoPage;
    gauges: IGauge[];
}

interface IInfoMapProps extends IInfoMapStateProps {
    draggable: boolean;
    guideId: string;
    height: string;
}

export interface IViewport {
    longitude: number;
    latitude: number;
    zoom: number;
    transitionDuration?: number;
    transitionInterpolator?: any;
}

interface IInfoMapState {
    markerList: IMarker[];
    viewport: IViewport;
    deleteMode: boolean;
    editMode: boolean;
    markers: {[key: string]: IMarker};
    openAddMarkerDialog: boolean;
    openDeleteDialog: boolean;
    newMarker: {
        category: string,
        name: string,
        description: string,
        lat: number,
        long: number,
        id: string;
    };
    viewModalOpen: boolean;
    selectedMarker?: IMarker;
    tile: string;
}

export const DEFAULT_VIEW_PORT: IViewport = {
    longitude: -122.45,
    latitude: 37.78,
    zoom: 14,
};

const warningIcon: JSX.Element = (
    <Warning
        className="map-marker"
        style={{color: "red"}}
    />);

class InfoMapComponent extends Component<IInfoMapProps, IInfoMapState> {
    constructor(props: IInfoMapProps) {
        super(props);
        const markers: {[key: string]: IMarker } = {};
        const markerList: IMarker[] = this.getMarkerList();
        for (const marker of markerList) {
            const id: string = uuid();
            marker.id = id;
            markers[id] = marker;
        }
        this.state = {
            markerList,
            viewport: this.getViewport(markerList),
            deleteMode: false,
            editMode: false,
            markers,
            openAddMarkerDialog: false,
            openDeleteDialog: false,
            newMarker: {
                category: "",
                name: "",
                description: "",
                lat: 0,
                long: 0,
                id: "",
            },
            viewModalOpen: false,
            tile: "mapbox://styles/mapbox/satellite-v9",
        };
    }

    public componentDidUpdate = (nextProps: IInfoMapProps): void => {
        if (nextProps.guideId !== this.props.guideId) {
            const markers: {[key: string]: IMarker } = {};
            const markerList: IMarker[] = this.getMarkerList();
            for (const marker of markerList) {
                const id: string = uuid();
                marker.id = id;
                markers[id] = marker;
            }
            this.setState({
                viewport: this.getViewport(markerList),
                markerList,
                markers,
            });
        }
    }

    public getViewport = (markerList: IMarker[]): IViewport => {
        const bounds: IMarker[] = markerList;
        let viewport: IViewport = DEFAULT_VIEW_PORT;
        viewport = {
            latitude: bounds[0].lat,
            longitude: bounds[0].lng,
            zoom: 12,
        };
        return viewport;
    }

    public handleClose = (): void => {
        this.setState({ viewModalOpen: false, selectedMarker: undefined });
    }

    public getGaugeLocation = (): IMarker[] => {
        const gauges: IGauge[] = this.props.gauges.filter(
            (item: IGauge) => item.id === this.props.infoPage.selectedGuide.gauge_id,
        );
        if (gauges.length > 0) {
            const gaugeMarkers: IMarker[] = gauges.map((item: IGauge) =>
                ({
                    name: item.display_name,
                    lat: item.position.lat,
                    lng: item.position.lon || 0,
                    id: item.display_name,
                    description: "Gauge",
                    category: "Gauge",
                }));
            return gaugeMarkers;
        }
        return [];
    }

    public getMarkerList = (): IMarker[] => {
        let markerList: IMarker[] | undefined =
            this.props.infoPage.itemDetails ? this.props.infoPage.itemDetails.markerList : [];
        if (this.props.infoPage.selectedGuide) {
            const marker: IMarker = {
                name: "Location",
                lat: this.props.infoPage.selectedGuide.position.lat,
                lng: this.props.infoPage.selectedGuide.position.lon || 0,
                id: "1",
                description: "",
                category: "",
            };

            if (markerList === null) {
                markerList = [];
            }
            markerList = markerList.concat(marker);
        }
        if (this.props.infoPage.selectedGuide && this.props.infoPage.selectedGuide.activity !== "data") {
            markerList = markerList.concat(this.getGaugeLocation());
        }
        return markerList;
    }

    public getMarkers = (): Array<(0 | JSX.Element)> => {
        let markerList: IMarker[] | undefined =
            this.props.infoPage.itemDetails &&
                this.props.infoPage.itemDetails.markerList ?
                    this.props.infoPage.itemDetails.markerList : [];
        if (this.props.infoPage.selectedGuide) {
            const marker: IMarker = {
                name: "Location",
                lat: this.props.infoPage.selectedGuide.position.lat,
                lng: this.props.infoPage.selectedGuide.position.lon || 0,
                id: "1",
                description: "",
                category: this.props.infoPage.selectedGuide.display_name,
            };
            markerList = markerList.concat(marker);
        }
        if (this.props.infoPage.selectedGuide && this.props.infoPage.selectedGuide.activity !== "data") {
            markerList = markerList.concat(this.getGaugeLocation());
        }
        const list: Array<(0 | JSX.Element)> = markerList.map(
            (marker: IMarker) =>
                marker.lat &&
                marker.lng && (
                    <Marker
                        key={uuid()}
                        longitude={marker.lng}
                        latitude={marker.lat}
                    >
                        <MapMarker
                            size={30}
                            toolTip={marker.name}
                            subtext={marker.category}
                            editMode={this.state.editMode}
                            onClick={(): void => {this.handleOpen(marker); }}
                            icon={marker.category === "Hazard" ? warningIcon : undefined}
                        />
                  </Marker>
                ),
        );
        return list;
    }

    public setViewportNav(newViewport: IViewport): void {
        const viewport: IViewport = {
            latitude: newViewport.latitude,
            longitude: newViewport.longitude,
            zoom: newViewport.zoom,
        };
        this.setState({ viewport });
    }

    public handleOpen = (marker: IMarker): void => {
        if (this.props.draggable) {
            this.setState({
                selectedMarker: marker,
                viewModalOpen: true,
            });
        } else {
            this.setState({
                selectedMarker: marker,
            });
        }
    }

    public onTileChange = (tile: string): void => {
        this.setState({
            tile,
        });
    }

    public render(): JSX.Element {
        const viewport: IViewport = this.state.viewport;
        return (
            <div className="info-map" style={{height: this.props.height}}>
                <ReactMapGL
                    dragPan={this.props.draggable}
                    touchAction="pan-y"
                    width="100%"
                    height="100%"
                    mapStyle={this.state.tile}
                    {...viewport}
                    mapboxApiAccessToken={TOKEN}
                    onViewportChange={(viewport: IViewport): void => this.setViewportNav(viewport)}
                >
                    {this.getMarkers()}
                <div style={{position: "absolute", right: 10, top: 10}}>
                    <NavigationControl
                        showCompass={false}
                        onViewportChange={(viewport: IViewport): void => this.setViewportNav(viewport)}
                        onViewStateChange={(): null => null}  />
                </div>
                <div style={{position: "absolute", left: 10, top: 10}}>
                    <TileSelector
                        tile={this.state.tile}
                        onTileChange={this.onTileChange}
                    />
                </div>
                </ReactMapGL>
                {this.state.selectedMarker &&
                    <ViewMarkerModal
                        handleClose={this.handleClose}
                        marker={this.state.selectedMarker}
                        isOpen={this.state.viewModalOpen}
                    />
                }
            </div>
        );
    }
}

function mapStateToProps(state: IState): IInfoMapStateProps {
    return ({
        infoPage: state.infoPage,
        gauges: state.gauges,
    });
}

export default connect(mapStateToProps)(InfoMapComponent);
