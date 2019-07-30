import "mapbox-gl/dist/mapbox-gl.css";
import React, { Component } from "react";
import ReactMapGL, { InteractiveMap, Marker, ViewState } from "react-map-gl";
import uuidv1 from "uuid";
import { IListEntry, IMapBounds } from "../../utils/types";
import Cluster from "./ClusterMapBox";
import { IViewport } from "./InfoMapComponent";
import MapCluster from "./MapCluster";
import MapMarker from "./MapMarker";
import TileSelector from "./TileSelector";

export const DEFAULT_LAT: number = -40.838875;
export const DEFAULT_LON: number = 171.7799;
export const DEFAULT_ZOOM: number = 5;

const TOKEN: string =
    "pk.eyJ1IjoiamhtY2theTkzIiwiYSI6ImNqd29oc2hzdjF3YnM0Ym4wa3o4azFhd2MifQ.dqrE-W1cXNGKpV5FGPZFww";

interface IMapComponentProps {
    guides: IListEntry[];
    filteredGuides: IListEntry[];
    listEntries: IListEntry[];
    onClick: (guide: IListEntry) => void;
    setMapBounds: (bounds: IMapBounds) => void;
    viewHeight: string;
}

interface IMapComponentState {
    viewport: IViewport;
    tile: string;
    map: any;
}

export class MapComponent extends Component<IMapComponentProps, IMapComponentState> {
    public prevZoom: number = 0;
    public prevMarkerSize: number = 0;
    public mapRef?: any = undefined;

    constructor(props: IMapComponentProps) {
        super(props);
        this.state = {
            viewport: {
                latitude: DEFAULT_LAT,
                longitude: DEFAULT_LON,
                zoom: DEFAULT_ZOOM,
            },
            map: null,
            tile: "mapbox://styles/mapbox/outdoors-v9",
        };
    }

    public onClusterClick = (): void => {
        // const boundingBox: IBoundingBox = cluster.boundingBox;
        // const {longitude, latitude} = new WebMercatorViewport(this.state.viewport)
        // .fitBounds([[boundingBox.minLon, boundingBox.minLat], [boundingBox.maxLon, boundingBox.maxLat]]);

        // const viewport: IViewport = {
        //     longitude: this.state.viewport.longitude,
        //     latitude: this.state.viewport.latitude,
        //     zoom: this.state.viewport.zoom + 2,
        // };
        // this.setState({viewport});
    }

    public componentDidMount(): void {
        // this.element = ReactDOM.findDOMNode(this);
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
        if (prevState.viewport.latitude !== this.state.viewport.latitude) {
            this.handleViewChange();
        }
    }

    public setViewport(newViewport: ViewState): void {
        const viewport: IViewport = {
            latitude: newViewport.latitude,
            longitude: newViewport.longitude,
            zoom: newViewport.zoom,
        };
        this.setState({ viewport });
    }

    public onTileChange = (tile: string): void => {
        this.setState({
            tile,
        });
    }

    public render(): JSX.Element {
        const viewport: IViewport = {
            latitude: this.state.viewport.latitude,
            longitude: this.state.viewport.longitude,
            zoom: this.state.viewport.zoom,
        };

        return (
            <div style={{width: "100%", height: "84vh"}}>
                <ReactMapGL
                    width="100%"
                    height="100%"
                    ref={(map: ReactMapGL | null): InteractiveMap | null => this.mapRef = map}
                    mapStyle={this.state.tile}
                    {...viewport}
                    onLoad={(): void => this.setState({ map: this.mapRef.getMap() })}
                    onViewportChange={(viewport: ViewState): void => this.setViewport(viewport)}
                    mapboxApiAccessToken={TOKEN}
                >
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
                            element={(clusterProps: {count: number; size: number; }): JSX.Element => (
                                <MapCluster
                                    size = {clusterProps.size}
                                    onClick={this.onClusterClick}
                                    count = {clusterProps.count}
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
