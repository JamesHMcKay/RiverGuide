import { PropTypes } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import React, { Component } from "react";
import ReactMapGL, { Marker, ViewState } from "react-map-gl";
import uuid from "uuidv4";
import WebMercatorViewport from "viewport-mercator-project";
import { IMarker } from "../../utils/types";
import MapMarker from "./MapMarker";

const TOKEN: string =
    "pk.eyJ1IjoiamhtY2theTkzIiwiYSI6ImNqbXZ0bnp6dzA3NG0zc3BiYjMxaWJrcTIifQ.BKESeoXyOqkiB8j1sjbxQg";

interface IInfoMapProps {
    markers: IMarker[];
}

export interface IViewport {
    // width: number;
    // height: number;
    longitude: number;
    latitude: number;
    zoom: number;
}

interface IInfoMapState {
    viewport: IViewport;
    deleteMode: boolean;
    editMode: boolean;
    addMode: boolean;
    markers: {[key: string]: IMarker};
}

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
            viewport: {
                // width: 800,
                // height: 300,
                longitude: -122.45,
                latitude: 37.78,
                zoom: 14,
            },
            deleteMode: false,
            editMode: false,
            addMode: true,
            markers,
        };
    }

    public onMarkerClick(markerId: string): void {
        if (this.state.editMode && this.state.deleteMode) {
            const markers: { [key: string]: IMarker} = {...this.state.markers};
            delete markers[markerId];
            this.setState({
                markers,
            });
        }
    }

    // public onMarkerDragStart = (event: any) => {
    // }

    // public onMarkerDrag = (event: any) => {
    // }

    public onMarkerDragEnd = (markerId: string, event: any): void => {
        const markers: { [key: string]: IMarker } = {...this.state.markers};
        markers[markerId].lat = event.lngLat[1];
        markers[markerId].lng = event.lngLat[0];
        this.setState({
            markers,
        });
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
                        draggable
                        // onDragStart={this.onMarkerDragStart}
                        onDragEnd={(event: any): void => this.onMarkerDragEnd(marker.id, event)}
                        // onDrag={this.onMarkerDrag}
                    >
                        <MapMarker
                            size={30}
                            toolTip={marker.name}
                            deleteMode={this.state.deleteMode}
                            onClick={(): void => this.onMarkerClick(marker.id)}
                        />
                  </Marker>
                ),
        );
        return list;
    }

    public setViewport(): IViewport {
        const bounds: IMarker[] = this.props.markers;
        let viewport: IViewport = {
            ...this.state.viewport,
        };
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
                ...this.state.viewport,
                longitude,
                latitude,
                zoom,
            };
        } else if (bounds.length === 1) {
            viewport = {
                ...this.state.viewport,
                latitude: bounds[0].lat,
                longitude: bounds[0].lng,
                zoom: 10,
            };
        }
        return viewport;
    }

    public onMapClick = (event: any): void => {
        if (!this.state.deleteMode && this.state.addMode) {
            // create a marker at this location
            const id: string = uuid();
            const marker: IMarker = {
                lat: event.lngLat[1],
                lng: event.lngLat[0],
                name: "no name",
                id,
            };
            const markers: { [key: string]: IMarker } = {...this.state.markers};

            markers[id] = marker;
            this.setState({
                markers,
            });
        }

    }

    public enterEditMode = (): void => {
        this.setState({
            editMode: true,
        });
    }

    public getEditButtons = (): JSX.Element => {
        const deleteColor: PropTypes.Color = !this.state.deleteMode ? "primary" : "secondary";
        const addColor: PropTypes.Color = !this.state.addMode ? "primary" : "secondary";
        return (
            <div className="info-map-buttons">
                <Button
                    variant="fab"
                    color={addColor}
                    aria-label="Add"
                    onClick={(): void => {this.setState({
                        deleteMode: false,
                        addMode: true,
                    }); }}
                >
                    <AddIcon/>
                </Button>
                <Button
                    variant="fab"
                    color={deleteColor}
                    aria-label="Add"
                    onClick={(): void => {this.setState({
                        addMode: false,
                        deleteMode: true,
                    }); }}
                >
                    <DeleteIcon/>
                </Button>
            </div>
        );
    }

    public onDragOver = (event: any): void => {
        event.preventDefault();
    }

    public render(): JSX.Element {
        const viewport: IViewport = this.setViewport();
        const editColor: PropTypes.Color = !this.state.editMode ? "primary" : "secondary";
        return (
            <div className="info-map">
                <div className="info-map-buttons">
                    <Button variant="fab" color={editColor} aria-label="Add"
                        onClick={(): void => {this.setState({editMode: !this.state.editMode}); }}
                    >
                        <EditIcon/>
                    </Button>
                    {this.state.editMode && this.getEditButtons()}
                </div>
                <ReactMapGL
                    width="100%"
                    height="100%"
                    mapStyle="mapbox://styles/mapbox/outdoors-v9"
                    {...viewport}
                    onViewportChange={(viewport: ViewState): null => null}
                    mapboxApiAccessToken={TOKEN}
                    onClick={this.onMapClick}
                    // onDragOver={(e) => this.onDragOver()}
                >
                    {this.getMarkers()}
                </ReactMapGL>
            </div>
        );
    }
}
