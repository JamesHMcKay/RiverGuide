import { PropTypes } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import EditIcon from "@material-ui/icons/Edit";
import React, { Component } from "react";
import ReactMapGL, { Marker, NavigationControl, ViewState } from "react-map-gl";
import uuid from "uuidv4";
import WebMercatorViewport from "viewport-mercator-project";
import { IMarker } from "../../utils/types";
import MapMarker from "./MapMarker";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import CloseIcon from "@material-ui/icons/Close";

const TOKEN: string =
    "pk.eyJ1IjoiamhtY2theTkzIiwiYSI6ImNqd29oc2hzdjF3YnM0Ym4wa3o4azFhd2MifQ.dqrE-W1cXNGKpV5FGPZFww";

interface IEditMapProps {
    markers: IMarker[];
}

export interface IViewport {
    // width: number;
    // height: number;
    longitude: number;
    latitude: number;
    zoom: number;
}

interface IEditMapState {
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

const categoryList: string[] = ["Put In", "Carpark", "Track",
    "Rapid", "Play", "Feature", "Waterfall", "Hazard", "Portage"].sort();

export default class EditMapComponent extends Component<IEditMapProps, IEditMapState> {
    constructor(props: IEditMapProps) {
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

    public onMarkerClick(markerId: string): void {
        if (this.state.editMode) {
            const markers: { [key: string]: IMarker} = {...this.state.markers};
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
            const markers: { [key: string]: IMarker } = {...this.state.markers};
            markers[markerId].lat = event.lngLat[1];
            markers[markerId].lng = event.lngLat[0];
            this.setState({
                markers,
        });
        } else {event.preventDefault(); }
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
                            editMode={this.state.editMode}
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
        const markers: { [key: string]: IMarker } = {...this.state.markers};
        markers[id] = marker;
        this.setState({
            markers,
        });
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
        const markers: { [key: string]: IMarker} = {...this.state.markers};
        delete markers[this.state.newMarker.id];
        this.setState({
                markers,
                deleteMode: false,
            });
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
            <Button color={editColor} aria-label="Add" title={`Turn edit mode ${toolTip}`}
                onClick={(): void => {this.setState({editMode: !this.state.editMode}); }}
            >
                {this.state.editMode ? <CloseIcon /> : <EditIcon  />}
            </Button>);
    }

    public render(): JSX.Element {
        const viewport: IViewport = this.setViewport();
        const editColor: PropTypes.Color = !this.state.editMode ? "primary" : "secondary";
        const {newMarker: {name, category, description}} = this.state;
        return (
            <div className="info-map">
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
                <div style={{position: "absolute", right: 5}}>
                    <NavigationControl onViewportChange={(): null => null}  onViewStateChange={(): null => null}  />
                </div>
                </ReactMapGL>
                <div className="info-map-buttons">
                     {this.editButton(editColor)}
                </div>
                {/* Marker dialog */}
                <div>
                    <Dialog
                        open={this.state.openAddMarkerDialog}
                        onClose={this.handleClose}
                        fullWidth
                        >
                        <DialogTitle >
                            <IconButton
                                aria-label="Close"
                                style={{position: "absolute", right: 0, top: 0}}
                                onClick={this.handleClose}
                            >
                                <CloseIcon />
                            </IconButton>
                            Please provide marker details
                        </DialogTitle>
                        <DialogContent>
                            <TextField
                                fullWidth
                                label="Name*"
                                variant="outlined"
                                margin="dense"
                                value={name}
                                onChange={this.handleChange("name")}
                                autoFocus
                            />
                            <br />
                            <TextField
                                select
                                label="Category*"
                                value={category}
                                onChange={this.handleChange("category")}
                                fullWidth
                                margin="dense"
                                variant="outlined"
                            >
                                {categoryList.map((category: string) =>
                                    <MenuItem key={category} value={category}>{category}</MenuItem>,
                                )}
                            </TextField>
                            <TextField
                                label="Description"
                                multiline
                                rows="4"
                                margin="dense"
                                variant="outlined"
                                fullWidth
                                value={description}
                                onChange={this.handleChange("description")}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button disabled={!name || !category } onClick={this.handleSave} color="secondary">
                                Save
                            </Button>
                            {this.state.deleteMode ?
                                <Button onClick={this.handleDelete} style={{color: "red"}}>
                                    Delete
                                </Button> :
                                <Button onClick={this.handleClose} color="primary">
                                    Cancel
                                </Button>
                            }
                        </DialogActions>
                    </Dialog>

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
