import React, { Component } from "react";
import ReactMapGL, { Marker } from "react-map-gl";
import WebMercatorViewport from "viewport-mercator-project";
import MapMarker from './MapMarker';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import Button from '@material-ui/core/Button';
import EditIcon from '@material-ui/icons/Edit';
import { PropTypes } from '@material-ui/core';
import uuid from 'uuidv4';
import { IMarker } from '../../utils/types';

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
        let markers: {[key: string]: IMarker} = {};

        for (let marker of props.markers) {
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
            markers: markers,
        };
    }

    onMarkerClick(markerId: string) {
        if (this.state.editMode && this.state.deleteMode) {
            let markers = {...this.state.markers};
            delete markers[markerId];
            this.setState({
                markers: markers
            });
        }
    }

    onMarkerDragStart = (event: any) => {
    }
    
    onMarkerDrag = (event: any) => {
    }

    onMarkerDragEnd = (markerId: string, event: any) => {
        let markers = {...this.state.markers};
        markers[markerId].lat = event.lngLat[1];
        markers[markerId].lng = event.lngLat[0];
        this.setState({
            markers: markers
        });
    }

    getMarkers = () => {
        const markersList: IMarker[] = Object.values(this.state.markers);

        let list = markersList.map(
            marker =>
                marker.lat &&
                marker.lng && (
                    <Marker
                        key={marker.lat}
                        longitude={marker.lng}
                        latitude={marker.lat}
                        draggable
                        onDragStart={this.onMarkerDragStart}
                        onDragEnd={(event) => this.onMarkerDragEnd(marker.id, event)}
                        onDrag={this.onMarkerDrag}
                    >
                        <MapMarker
                            size={30}
                            toolTip={marker.name}
                            deleteMode={this.state.deleteMode}
                            onClick={() => this.onMarkerClick(marker.id)}
                        />
                  </Marker>
                )
        );
        return list;
    }

    setViewport() {
        let bounds = this.props.markers;
        let viewport = {
            ...this.state.viewport
        };
        if (bounds.length >= 2) {
            const putInLat = bounds[0].lat;
            const putInLon = bounds[0].lng;

            const takeOutLat = bounds[bounds.length - 1].lat;
            const takeOutLon = bounds[bounds.length - 1].lng;

            const { longitude, latitude, zoom } = new WebMercatorViewport(
                this.state.viewport
            ).fitBounds([[putInLon, putInLat], [takeOutLon, takeOutLat]], {
                padding: 20,
                offset: [0, 0]
            });

            viewport = {
                ...this.state.viewport,
                longitude,
                latitude,
                zoom
            };
        } else if (bounds.length === 1) {
            viewport = {
                ...this.state.viewport,
                latitude: bounds[0].lat,
                longitude: bounds[0].lng,
                zoom: 10
            };
        }
        return viewport;
    }

    onMapClick = (event: any) => {
        if (!this.state.deleteMode && this.state.addMode) {
            //create a marker at this location
            const id = uuid();
            let marker = {
                lat: event.lngLat[1],
                lng: event.lngLat[0],
                name: 'no name',
                id: id,
            }
            let markers = {...this.state.markers};
            
            markers[id] = marker;
            this.setState({
                markers: markers
            });
        }
       
    }

    enterEditMode = () => {
        this.setState({
            editMode: true,
        });
    }

    getEditButtons = () => {
        let deleteColor: PropTypes.Color = !this.state.deleteMode ? "primary" : "secondary";
        let addColor: PropTypes.Color = !this.state.addMode ? "primary" : "secondary";
        return (
            <div className="info-map-buttons">
                <Button 
                    variant="fab"
                    color={addColor}
                    aria-label="Add"
                    onClick={() => {this.setState({
                        deleteMode: false,
                        addMode: true
                    })}}
                >
                    <AddIcon/>
                </Button>
                <Button
                    variant="fab"
                    color={deleteColor}
                    aria-label="Add"
                    onClick={() => {this.setState({
                        addMode: false,
                        deleteMode: true
                    })}}
                >
                    <DeleteIcon/>
                </Button>
            </div>
        );
    }

    onDragOver = (event: any) => {
        event.preventDefault();
        console.log(event);
    }

    render() {
        const viewport = this.setViewport();
        let editColor: PropTypes.Color = !this.state.editMode ? "primary" : "secondary";
        return (
            <div className="info-map">
                <div className="info-map-buttons">
                    <Button variant="fab" color={editColor} aria-label="Add"
                        onClick={() => {this.setState({editMode: !this.state.editMode})}}
                    >
                        <EditIcon/>
                    </Button>
                    {this.state.editMode && this.getEditButtons()}
                </div>
                <ReactMapGL
                    mapStyle="mapbox://styles/mapbox/outdoors-v9"
                    {...viewport}
                    onViewportChange={viewport => {}}
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
