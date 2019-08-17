import "mapbox-gl/dist/mapbox-gl.css";
import React, { Component } from "react";
import ReactGA from "react-ga";
import ReactMapGL, { FlyToInterpolator, InteractiveMap, Marker, NavigationControl, ViewState } from "react-map-gl";
import { connect } from "react-redux";
import uuidv1 from "uuid";
import { IState } from "../../reducers";
import { IListEntry, IMapBounds } from "../../utils/types";
import { setViewport } from "./../../actions/actions";
import Cluster from "./ClusterMapBox";
import { IViewport } from "./InfoMapComponent";
import MapCluster from "./MapCluster";
import MapMarker from "./MapMarker";
import TileSelector from "./TileSelector";

export const DEFAULT_LAT: number = -40.838875;
export const DEFAULT_LON: number = 171.7799;
export const DEFAULT_ZOOM: number = 5;

const TOKEN: string = process.env.REACT_APP_MAPBOX_TOKEN || "";

interface IMapClusterProps {
    count: number; size: number;
    zoomLevel: number;
    longitude: number;
    latitude: number;
}

interface IMapComponentStateProps {
    viewport: IViewport;
}

interface IMapComponentProps extends IMapComponentStateProps {
    guides: IListEntry[];
    filteredGuides: IListEntry[];
    listEntries: IListEntry[];
    onClick: (guide: IListEntry) => void;
    setMapBounds: (bounds: IMapBounds) => void;
    viewHeight: string;
    setViewport: (viewport: IViewport) => void;
}

interface IMapComponentState {
    tile: string;
    map: any;
}

class MapComponent extends Component<IMapComponentProps, IMapComponentState> {
    public prevZoom: number = 0;
    public prevMarkerSize: number = 0;
    public mapRef?: any = undefined;

    constructor(props: IMapComponentProps) {
        super(props);
        this.state = {
            map: null,
            tile: "mapbox://styles/mapbox/outdoors-v9",
        };
    }

    public onClusterClick = (zoomLevel: number, latitude: number, longitude: number): void => {
        ReactGA.event({
            category: "Map",
            action: "ClusterClick",
            label: this.props.viewport.zoom.toString(),
        });
        const viewport: IViewport = {
            ...this.props.viewport,
            longitude,
            latitude,
            zoom: zoomLevel,
            transitionDuration: 300,
            transitionInterpolator: new FlyToInterpolator(),
        };
        this.props.setViewport(viewport);
    }

    public handleViewChange(): void {
        if (this.mapRef) {
            this.props.setMapBounds(this.mapRef.getMap().getBounds());
        }
    }

    public shouldComputeClusters(prevProps: IMapComponentProps, props: IMapComponentProps): boolean {
        if (!prevProps.guides && props.guides) {
            return true;
        } else if (prevProps.guides && props.guides && prevProps.guides.length !== props.guides.length ) {
            return true;
        } else {
            return false;
        }
    }

    public componentDidUpdate(prevProps: IMapComponentProps, prevState: IMapComponentState): void {
        if (prevProps.viewport.latitude !== this.props.viewport.latitude) {
            this.handleViewChange();
        }
    }

    public setViewport(newViewport: ViewState): void {
        const viewport: IViewport = {
            latitude: newViewport.latitude,
            longitude: newViewport.longitude,
            zoom: newViewport.zoom,
        };
        this.props.setViewport(viewport);
    }

    public onTileChange = (tile: string): void => {
        this.setState({
            tile,
        });
    }

    public setViewportNav(newViewport: IViewport): void {
        const viewport: IViewport = {
            latitude: newViewport.latitude,
            longitude: newViewport.longitude,
            zoom: newViewport.zoom,
        };
        this.props.setViewport(viewport);
    }

    public render(): JSX.Element {
        return (
            <div style={{width: "100%", height: this.props.viewHeight}}>
                <ReactMapGL
                    width="100%"
                    height="100%"
                    ref={(map: ReactMapGL | null): InteractiveMap | null => this.mapRef = map}
                    mapStyle={this.state.tile}
                    {...this.props.viewport}
                    onLoad={(): void => this.setState({ map: this.mapRef.getMap() })}
                    onViewportChange={(viewport: ViewState): void => this.setViewport(viewport)}
                    mapboxApiAccessToken={TOKEN}
                >
                    <div style={{position: "absolute", right: 10, top: 10}}>
                        <NavigationControl
                            showCompass={false}
                            onViewportChange={(viewport: IViewport): void => this.setViewportNav(viewport)}
                            onViewStateChange={(): null => null}
                        />
                     </div>
                    <div style={{position: "absolute", left: 10, top: 10}}>
                        <TileSelector
                            tile={this.state.tile}
                            onTileChange={this.onTileChange}
                        />
                    </div>
                    {this.state.map && (
                        <Cluster
                            map={this.state.map}
                            radius={100}
                            extent={512}
                            nodeSize={40}
                            element={(clusterProps: IMapClusterProps): JSX.Element => (
                                <MapCluster
                                    size = {clusterProps.size}
                                    onClick={this.onClusterClick}
                                    count = {clusterProps.count}
                                    zoomLevel = {clusterProps.zoomLevel}
                                    latitude = {clusterProps.latitude}
                                    longitude = {clusterProps.longitude}
                                />
                            )}
                        >
                            {this.props.filteredGuides.map((item: IListEntry) => (
                            <Marker
                                key={uuidv1()}
                                longitude={item.position.lon || 0}
                                latitude={item.position.lat}
                            >
                                <MapMarker
                                    size={30}
                                    onClick={(): void => {this.props.onClick(item); }}
                                    toolTip={item.display_name}
                                    observables={item.observables}
                                    editMode={false}
                                />
                            </Marker>
                            ))}
                        </Cluster>
                        )}
                </ReactMapGL>
            </div>
        );
    }
}

function mapStateToProps(state: IState): IMapComponentStateProps {
    return ({
        viewport: state.mapViewport,
    });
}

export default connect(
    mapStateToProps,
    { setViewport },
)(MapComponent);
