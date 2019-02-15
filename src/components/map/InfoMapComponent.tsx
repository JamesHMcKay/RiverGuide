import { PropTypes } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import React, { Component } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import uuid from "uuidv4";
import WebMercatorViewport from "viewport-mercator-project";
import { IMarker } from "../../utils/types";
import MapMarker from "./MapMarker";

const TOKEN =
    "pk.eyJ1IjoiamhtY2theTkzIiwiYSI6ImNqbXZ0bnp6dzA3NG0zc3BiYjMxaWJrcTIifQ.BKESeoXyOqkiB8j1sjbxQg";

interface IInfoMapProps {
    markers: IMarker[];
}

export interface IViewport {
    width: number;
    height: number;
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
        const markers: {[key: string]: IMarker} = {};

        for (const marker of props.markers) {
            const id = uuid();
            marker.id = id;
            markers[id] = marker;
        }
        this.state = {
            viewport: {
                width: 800,
                height: 300,
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

    public onMarkerClick(markerId: string) {
        if (this.state.editMode && this.state.deleteMode) {
            const markers = {...this.state.markers};
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

    public onMarkerDragEnd = (markerId: string, event: any) => {
        const markers = {...this.state.markers};
        markers[markerId].lat = event.lngLat[1];
        markers[markerId].lng = event.lngLat[0];
        this.setState({
            markers,
        });
    }

    public getMarkers = () => {
        const markersList: IMarker[] = Object.values(this.state.markers);

        const list = markersList.map(
            (marker) =>
                marker.lat &&
                marker.lng && (
                    <Marker
                        key={marker.lat}
                        longitude={marker.lng}
                        latitude={marker.lat}
                        draggable
                        // onDragStart={this.onMarkerDragStart}
                        onDragEnd={(event) => this.onMarkerDragEnd(marker.id, event)}
                        // onDrag={this.onMarkerDrag}
                    >
                        <MapMarker
                            size={30}
                            toolTip={marker.name}
                            deleteMode={this.state.deleteMode}
                            onClick={() => this.onMarkerClick(marker.id)}
                        />
                  </Marker>
                ),
        );
        return list;
    }

    public setViewport() {
        const bounds = this.props.markers;
        let viewport = {
            ...this.state.viewport,
        };
        if (bounds.length >= 2) {
            const putInLat = bounds[0].lat;
            const putInLon = bounds[0].lng;

            const takeOutLat = bounds[bounds.length - 1].lat;
            const takeOutLon = bounds[bounds.length - 1].lng;

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

    public onMapClick = (event: any) => {
        if (!this.state.deleteMode && this.state.addMode) {
            // create a marker at this location
            const id = uuid();
            const marker = {
                lat: event.lngLat[1],
                lng: event.lngLat[0],
                name: "no name",
                id,
            };
            const markers = {...this.state.markers};

            markers[id] = marker;
            this.setState({
                markers,
            });
        }

    }

    public enterEditMode = () => {
        this.setState({
            editMode: true,
        });
    }

    public getEditButtons = () => {
        const deleteColor: PropTypes.Color = !this.state.deleteMode ? "primary" : "secondary";
        const addColor: PropTypes.Color = !this.state.addMode ? "primary" : "secondary";
        return (
            <div className="info-map-buttons">
                <Button
                    variant="fab"
                    color={addColor}
                    aria-label="Add"
                    onClick={() => {this.setState({
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
                    onClick={() => {this.setState({
                        addMode: false,
                        deleteMode: true,
                    }); }}
                >
                    <DeleteIcon/>
                </Button>
            </div>
        );
    }

    public onDragOver = (event: any) => {
        event.preventDefault();
    }

    public render() {
        const viewport = this.setViewport();
        const editColor: PropTypes.Color = !this.state.editMode ? "primary" : "secondary";
        return (
            <div className="info-map">
                <div className="info-map-buttons">
                    <Button variant="fab" color={editColor} aria-label="Add"
                        onClick={() => {this.setState({editMode: !this.state.editMode}); }}
                    >
                        <EditIcon/>
                    </Button>
                    {this.state.editMode && this.getEditButtons()}
                </div>
                <ReactMapGL
                    mapStyle="mapbox://styles/mapbox/outdoors-v9"
                    {...viewport}
                    onViewportChange={(viewport) => null}
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
