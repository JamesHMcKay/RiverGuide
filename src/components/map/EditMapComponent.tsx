import { PropTypes } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import EditIcon from "@material-ui/icons/Edit";
import React, { Component } from "react";
import ReactMapGL, { Marker, NavigationControl } from "react-map-gl";
import uuid from "uuidv4";
import WebMercatorViewport from "viewport-mercator-project";
import { IMarker } from "../../utils/types";
import { DEFAULT_VIEW_PORT } from "./InfoMapComponent";
import MapMarker from "./MapMarker";
import MarkerModal from "./MarkerModal";

const TOKEN: string =
    "pk.eyJ1IjoiamhtY2theTkzIiwiYSI6ImNqd29oc2hzdjF3YnM0Ym4wa3o4azFhd2MifQ.dqrE-W1cXNGKpV5FGPZFww";

interface IEditMapProps {
    markers: {[key: string]: IMarker};
    gaugeMarkers: IMarker[];
    locationMarker: IMarker[];
    updateMarkers: (markers: {[key: string]: IMarker}) => void;
}

export interface IViewport {
    longitude: number;
    latitude: number;
    zoom: number;
}

interface IEditMapState {
    viewport: IViewport;
    deleteMode: boolean;
    editMode: boolean;
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

export default class EditMapComponent extends Component<IEditMapProps, IEditMapState> {
    constructor(props: IEditMapProps) {
        super(props);
        this.state = {
            viewport: this.getViewport(this.props.locationMarker),
            deleteMode: false,
            editMode: true,
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

    public onMarkerClick(markerId: string, canEdit: boolean): void {
        if (this.state.editMode && canEdit) {
            const markers: { [key: string]: IMarker} = {...this.props.markers};
            this.setState({
                    deleteMode: true,
                    openAddMarkerDialog: true,
                    newMarker: {
                        category: markers[markerId].category ? markers[markerId].category : "",
                        name: markers[markerId].name,
                        description: markers[markerId].description,
                        lat: markers[markerId].lat,
                        long: markers[markerId].lng,
                        id: markerId,
                    },
                });
            }
        }

    public onMarkerDragEnd = (markerId: string, event: any): void => {
        if (this.state.editMode) {
            const markers: { [key: string]: IMarker } = {...this.props.markers};
            markers[markerId].lat = event.lngLat[1];
            markers[markerId].lng = event.lngLat[0];
            this.props.updateMarkers(markers);
        } else {event.preventDefault(); }
    }

    public getMarkers = (markerList: IMarker[], color: string, canEdit: boolean): Array<(0 | JSX.Element)> => {
        const list: Array<(0 | JSX.Element)> = markerList.map(
            (marker: IMarker) =>
                marker.lat &&
                marker.lng && (
                    <Marker
                        key={marker.lat}
                        longitude={marker.lng}
                        latitude={marker.lat}
                        draggable={canEdit}
                        onDragEnd={(event: any): void => this.onMarkerDragEnd(marker.id, event)}
                    >
                        <MapMarker
                            size={30}
                            toolTip={marker.name}
                            editMode={this.state.editMode}
                            onClick={(): void => this.onMarkerClick(marker.id, canEdit)}
                            color={color}
                        />
                  </Marker>
                ),
        );
        return list;
    }

    public setViewport(): IViewport {
        const bounds: IMarker[] = Object.values(this.props.markers);
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
        if (this.state.editMode) {
            const id: string = uuid();
            this.setState({
                deleteMode: false,
                openAddMarkerDialog: true,
                newMarker: {
                    ...this.state.newMarker,
                    id,
                    lat: event.lngLat[1],
                    long: event.lngLat[0],
                },
            });
        }

    }

    public enterEditMode = (): void => {
        this.setState({
            editMode: true,
        });
    }

    public onDragOver = (event: any): void => {
        event.preventDefault();
    }
    public handleClose = (): void => {
        this.setState({ openAddMarkerDialog: false, openDeleteDialog: false });
        this.resetNewMarkerState();
    }
    public handleChange = (name: any): (({ target: {value}}: any) => void) => ({ target: {value}}: any): void => {
        this.setState({
            newMarker: {
                ...this.state.newMarker,
                [name]: value,
            },
        });
    }
    public capitalizeFirstLetter = (word: string): string => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }
    public handleSave = (): void => {
        const {newMarker: {category, description, id, lat, long}} = this.state;
        let {newMarker: {name}} = this.state;
        const capitalizedName: string = this.capitalizeFirstLetter(name);
        name = capitalizedName;
        const marker: IMarker = {
                lat,
                lng: long,
                name,
                id,
                description,
                category,
            };
        const markers: { [key: string]: IMarker } = {...this.props.markers};
        markers[id] = marker;
        this.props.updateMarkers(markers);
        this.handleClose();
        this.resetNewMarkerState();
    }
    public handleDelete = (): void => {
       this.setState({openDeleteDialog: true});
    }

    public handleDeleteClose = (): void => {
        this.setState({openDeleteDialog: false});
    }

    public deleteMarker = (): void => {
        const markers: { [key: string]: IMarker} = {...this.props.markers};
        delete markers[this.state.newMarker.id];
        this.setState({
                deleteMode: false,
            });
        this.props.updateMarkers(markers);
        this.resetNewMarkerState();
        this.handleDeleteClose();
        this.handleClose();
    }

    public resetNewMarkerState = (): void => {
        this.setState({
            newMarker: {
                category: "",
                name: "",
                description: "",
                lat: 0,
                long: 0,
                id: "",
            },
        });
    }
    public editButton = (editColor: PropTypes.Color): JSX.Element => {
        const toolTip: string = !this.state.editMode ? "On" : "Off";
        return (
            <Button
                color={editColor}
                aria-label="Add"
                title={`Turn edit mode ${toolTip}`}
                onClick={(): void => {this.setState({editMode: !this.state.editMode}); }}
            >
                {this.state.editMode ? <CloseIcon /> : <EditIcon  />}
            </Button>);
    }

    public setViewportNav(newViewport: IViewport): void {
        const viewport: IViewport = {
            latitude: newViewport.latitude,
            longitude: newViewport.longitude,
            zoom: newViewport.zoom,
        };
        this.setState({ viewport });
    }

    public getViewport = (markerList: IMarker[]): IViewport => {
        const bounds: IMarker[] = markerList;
        let viewport: IViewport = DEFAULT_VIEW_PORT;
        viewport = {
            latitude: bounds[0].lat,
            longitude: bounds[0].lng,
            zoom: 10,
        };
        return viewport;
    }

    public render(): JSX.Element {
        const viewport: IViewport = this.state.viewport;
        // const editColor: PropTypes.Color = !this.state.editMode ? "primary" : "secondary";
        const {newMarker: {name, category, description}} = this.state;
        const markers: IMarker[] = Object.values(this.props.markers);
        return (
            <div className="info-map" style={{height: "400px"}}>
                <ReactMapGL
                    width="100%"
                    height="100%"
                    mapStyle="mapbox://styles/mapbox/outdoors-v9"
                    {...viewport}
                    onViewportChange={(viewport: IViewport): void => this.setViewportNav(viewport)}
                    mapboxApiAccessToken={TOKEN}
                    onClick={this.onMapClick}
                    // onDragOver={(e) => this.onDragOver()}
                >
                    {this.getMarkers(markers, "blue", true)}
                    {this.getMarkers(this.props.gaugeMarkers, "red", false)}
                    {this.getMarkers(this.props.locationMarker, "red", false)}
                <div style={{position: "absolute", right: 5}}>
                    <NavigationControl onViewportChange={(): null => null}  onViewStateChange={(): null => null}  />
                </div>
                </ReactMapGL>
                {/* <div className="info-map-buttons">
                     {this.editButton(editColor)}
                </div> */}
                {/* Marker dialog */}
                <div>
                <MarkerModal
                    handleClose={this.handleClose}
                    handleChange={this.handleChange}
                    handleDelete={this.handleDelete}
                    handleSave={this.handleSave}
                    name={name}
                    description={description}
                    category={category}
                    deleteMode={this.state.deleteMode}
                    isOpen={this.state.openAddMarkerDialog}
                />
                    {/* Delete confirmation dialog */}
                    <Dialog open={this.state.openDeleteDialog}>
                        <DialogTitle>
                            Are you sure you would like to delete this marker?
                        </DialogTitle>
                        <DialogActions>
                            <Button onClick={this.handleDeleteClose} color="primary">
                                Cancel
                            </Button>
                            <Button onClick={this.deleteMarker} color="secondary">
                                Yes
                            </Button>
                        </DialogActions>
                    </Dialog>
                </div>
            </div>
        );
    }
}
