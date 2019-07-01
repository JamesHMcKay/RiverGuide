import React, { Component } from "react";
import ReactMapGL, { Marker, NavigationControl } from "react-map-gl";
import uuid from "uuidv4";
import WebMercatorViewport from "viewport-mercator-project";
import { IMarker } from "../../utils/types";
import MapMarker from "./MapMarker";

const TOKEN: string =
    "pk.eyJ1IjoiamhtY2theTkzIiwiYSI6ImNqd29oc2hzdjF3YnM0Ym4wa3o4azFhd2MifQ.dqrE-W1cXNGKpV5FGPZFww";

interface IInfoMapProps {
    markers: IMarker[];
    draggable: boolean;
}

export interface IViewport {
    longitude: number;
    latitude: number;
    zoom: number;
}

interface IInfoMapState {
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
}

const DEFAULT_VIEW_PORT: IViewport = {
    longitude: -122.45,
    latitude: 37.78,
    zoom: 14,
};

export default class InfoMapComponent extends Component<IInfoMapProps, IInfoMapState> {
    constructor(props: IInfoMapProps) {
        super(props);
        const markers: {[key: string]: IMarker } = {};

        for (const marker of props.markers) {
            const id: string = uuid();
            marker.id = id;
            markers[id] = marker;
        }
        this.state = {
            viewport: this.getViewport(),
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
        };
    }

    public getViewport(): IViewport {
        const bounds: IMarker[] = this.props.markers;
        let viewport: IViewport = DEFAULT_VIEW_PORT;
        if (bounds.length >= 2) {
            const putInLat: number = bounds[0].lat;
            const putInLon: number = bounds[0].lng;

            const takeOutLat: number = bounds[bounds.length - 1].lat;
            const takeOutLon: number = bounds[bounds.length - 1].lng;

            const { longitude, latitude, zoom } = new WebMercatorViewport(
                this.state.viewport,
            ).fitBounds([[putInLon, putInLat], [takeOutLon, takeOutLat]], {
                padding: 20,
                offset: [0, 0],
            });

            viewport = {
                longitude,
                latitude,
                zoom,
            };
        } else if (bounds.length === 1) {
            viewport = {
                latitude: bounds[0].lat,
                longitude: bounds[0].lng,
                zoom: 10,
            };
        }
        return viewport;
    }

    public getMarkers = (): Array<(0 | JSX.Element)> => {
        const markersList: IMarker[] = Object.values(this.state.markers);
        const list: Array<(0 | JSX.Element)> = markersList.map(
            (marker: IMarker) =>
                marker.lat &&
                marker.lng && (
                    <Marker
                        key={marker.lat}
                        longitude={marker.lng}
                        latitude={marker.lat}
                    >
                        <MapMarker
                            size={30}
                            toolTip={marker.name}
                            editMode={this.state.editMode}
                            onClick={(): void => {return; }}
                        />
                  </Marker>
                ),
        );
        return list;
    }

    public setViewportNav(newViewport: IViewport): void {
        const viewport: IViewport = {
            // width: this.state.viewport.width,
            // height: this.state.viewport.height,
            latitude: newViewport.latitude,
            longitude: newViewport.longitude,
            zoom: newViewport.zoom,
        };
        this.setState({ viewport });
    }

    public render(): JSX.Element {
        const viewport: IViewport = this.state.viewport;
        return (
            <div className="info-map">
                <ReactMapGL
                    dragPan={this.props.draggable}
                    touchAction="pan-y"
                    width="100%"
                    height="100%"
                    mapStyle="mapbox://styles/mapbox/outdoors-v9"
                    {...viewport}
                    mapboxApiAccessToken={TOKEN}
                    onViewportChange={(viewport: IViewport): void => this.setViewportNav(viewport)}
                >
                    {this.getMarkers()}
                <div style={{position: "absolute", right: 5}}>
                    <NavigationControl
                        showCompass={false}
                        onViewportChange={(viewport: IViewport): void => this.setViewportNav(viewport)}
                        onViewStateChange={(): null => null}  />
                </div>
                </ReactMapGL>
            </div>
        );
    }
}
