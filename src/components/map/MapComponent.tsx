import "mapbox-gl/dist/mapbox-gl.css";
import * as kmeans from "node-kmeans";
import React, { Component } from "react";
import ReactMapGL, { InteractiveMap, Marker, ViewState } from "react-map-gl";
import uuidv1 from "uuid";
import WebMercatorViewport from "viewport-mercator-project";
import { ILatLon, IListEntry, IMapBounds } from "../../utils/types";
import { IViewport } from "./InfoMapComponent";
import MapCluster from "./MapCluster";
import MapMarker from "./MapMarker";
import TileSelector from "./TileSelector";

export const DEFAULT_LAT: number = -41.838875;
export const DEFAULT_LON: number = 171.7799;
export const DEFAULT_ZOOM: number = 6;

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
    clusterLocations: ICluster[];
    tile: string;
}

interface ICluster {
    boundingBox: IBoundingBox;
    lat: number;
    lon: number;
    markers: IListEntry[];
    count: number;
    averageLat: number;
    averageLon: number;
}

interface IKMeansCluster {
    clusterInd: number[];
    centroid: number[];
    boundingBox: IBoundingBox;
}

interface IBoundingBox {
    maxLat: number;
    maxLon: number;
    minLat: number;
    minLon: number;
}

// interface IFeatureItem {
//     type: string;
//     properties: null;
//     geometry: {
//         type: string;
//         coordinates: [number, number]
//     };
// }

// interface IFeatureCollection {
//     type: string;
//     features: IFeatureItem[];
// }

export class MapComponent extends Component<IMapComponentProps, IMapComponentState> {
    public prevZoom: number = 0;
    public prevMarkerSize: number = 0;
    public clusterLocations: ICluster[] = [];
    public mapRef?: any = undefined;

    constructor(props: IMapComponentProps) {
        super(props);
        this.state = {
            viewport: {
                latitude: DEFAULT_LAT,
                longitude: DEFAULT_LON,
                zoom: DEFAULT_ZOOM,
            },
            clusterLocations: [],
            tile: "mapbox://styles/mapbox/outdoors-v9",
        };
        this.computeCustersKmeans();
    }

    // public getRegion = (guide: IListEntry): string => {
    //     return guide.region;
    // }

    public onlyUnique = (value: string, index: number, self: any): boolean => {
        return self.indexOf(value) === index;
    }

    public getViewportSpan(): number {
        if (this.mapRef) {
            const mapBounds: IMapBounds = this.mapRef.getMap().getBounds();
            const upperLat: number = mapBounds._ne.lat;
            const upperLon: number | undefined = mapBounds._ne.lng;
            const lowerLat: number = mapBounds._sw.lat;
            const lowerLon: number | undefined = mapBounds._sw.lng;

            const span: number = this.getProximity(
                {lat: upperLat, lng: upperLon},
                {lat: lowerLat, lng: lowerLon},
            );
            return span;
        } else {
            return 1000;
        }
    }

    public getProximity(markerOne: ILatLon, markerTwo: ILatLon): number {
        const lat1: number = markerOne.lat;
        const lat2: number = markerTwo.lat;
        const lon1: number = markerOne.lng || markerOne.lon || 0;
        const lon2: number = markerTwo.lng || markerTwo.lon || 0;
        const R: number = 6371e3;
        const phi1: number = lat1 * (Math.PI / 180);
        const phi2: number = lat2 * (Math.PI / 180);
        const deltaPhi: number = (lat2 - lat1) * (Math.PI / 180);
        const deltaLambda: number = (lon2 - lon1) * (Math.PI / 180);
        const a: number = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
                Math.cos(phi1) * Math.cos(phi2) *
                Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
        const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d: number = R * c;
        return d;
    }

    public createClusters(result: IKMeansCluster[]): ICluster[] {
        const clusterLocations: ICluster[] = [];
        const guides: IListEntry[] = this.props.guides;
        for (const cluster of result) {
            const markers: IListEntry[] = [];
            const clusterInd: number[] = cluster.clusterInd;
            const boundingBox: Partial<IBoundingBox> = {};
            for (const ind of clusterInd) {
                const marker: IListEntry = guides[ind];
                markers.push(marker);
                if (marker && marker.position.lat && marker.position.lon) {
                    if (!boundingBox.maxLat || marker.position.lat > boundingBox.maxLat) {
                        boundingBox.maxLat = marker.position.lat;
                    }
                    if (!boundingBox.maxLon || marker.position.lon > boundingBox.maxLon) {
                        boundingBox.maxLon = marker.position.lon;
                    }

                    if (!boundingBox.minLon || marker.position.lon < boundingBox.minLon) {
                        boundingBox.minLon = marker.position.lon;
                    }
                    if (!boundingBox.minLat || marker.position.lon < boundingBox.minLat) {
                        boundingBox.minLat = marker.position.lat;
                    }
                }
                cluster.boundingBox = boundingBox as IBoundingBox;
            }

            clusterLocations.push({
                boundingBox: cluster.boundingBox,
                lat: cluster.centroid[0],
                lon: cluster.centroid[1],
                markers,
                count: clusterInd.length,
                averageLat: cluster.centroid[0],
                averageLon: cluster.centroid[1],
            });
        }
        return clusterLocations;
    }

    public computeCustersKmeans(): void {
        const numberOfMarkers: number = this.props.listEntries.length;
        let numberOfClusters: number = 10;

        if (numberOfMarkers > 0) {
            numberOfClusters = Math.ceil(numberOfMarkers / 15);
        }

        const guides: IListEntry[] = this.props.guides;
        const locations: Array<Array<number | undefined>> = [];

        for (const guide of guides) {
            locations.push([ guide.position.lat , guide.position.lon]);
        }

        if (locations.length < numberOfClusters) {
            numberOfClusters = locations.length;
        }
        if (locations.length === 0) {
            return;
        }

        kmeans.clusterize(
            locations,
            {k: numberOfClusters},
            (err: any, res: any): void => {
                if (err) {
                    console.error(err);
                } else {
                    const clusters: ICluster[] = this.createClusters(res);
                    this.setState({clusterLocations: clusters});
                }
            },
        );
    }

    public getMarkersOrCluster(): Array<(0 | JSX.Element | undefined)> {
        if (this.state.viewport.zoom < 7.5) {
            return this.getClusters();
        } else {
            return this.getMarkers();
        }
    }

    public onClusterClick(cluster: ICluster): void {
        const boundingBox: IBoundingBox = cluster.boundingBox;
        const {longitude, latitude} = new WebMercatorViewport(this.state.viewport)
        .fitBounds([[boundingBox.minLon, boundingBox.minLat], [boundingBox.maxLon, boundingBox.maxLat]]);

        const viewport: IViewport = {
            // ...this.state.viewport,
            longitude,
            latitude,
            zoom: 8,
            // transitionDuration: 5000,
            // transitionInterpolator: new FlyToInterpolator(),
        };
        this.setState({viewport});
    }

    public getClusters(): Array<(0 | JSX.Element)> {
        let clusters: ICluster[] = this.state.clusterLocations;
        if (!clusters) {
            clusters = [];
        }
        const list: Array<(0 | JSX.Element)> = clusters.map(
            (cluster: ICluster) =>
            cluster.lat &&
            cluster.lon && (
                    <Marker
                    key={uuidv1()}
                    longitude={cluster.lon}
                    latitude={cluster.lat}
                     >
                        <MapCluster
                            size={30}
                            count={cluster.count}
                            onClick={(): void => this.onClusterClick(cluster)}
                        />
                    </Marker>
                ),
        );
        return list;
    }

    // public getFeatureList(): IFeatureCollection {
    //     const list: IFeatureItem[] = this.props.filteredGuides.map(
    //         (guide: IListEntry) => {
    //             return ({
    //                 type: "Feature",
    //                 properties: null,
    //                 geometry: {
    //                     type: "Point",
    //                     coordinates: [guide.position.lon || 0, guide.position.lat]
    //                 }
    //             });
    //         })
    //     return {
    //         type: "FeatureCollection",
    //         features: list,
    //     };
    // }

    public getMarkers = (): Array<(0 | JSX.Element | undefined)> => {
        const list: Array<(0 | JSX.Element | undefined)>  = this.props.filteredGuides.map(
            (guide: IListEntry) =>
                guide.position.lat &&
                guide.position.lon && (
                    <Marker
                        key={uuidv1()}
                        longitude={guide.position.lon}
                        latitude={guide.position.lat}
                    >
                        <MapMarker
                            size={30}
                            onClick={(): void => {this.props.onClick(guide); }}
                            toolTip={guide.display_name}
                            observables={guide.observables}
                            editMode={false}
                        />
                  </Marker>
                ),
        );
        return list;
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
        } else if (!this.state.clusterLocations || this.state.clusterLocations.length === 0) {
            return true;
        } else {
            return false;
        }
    }

    public componentDidUpdate(prevProps: IMapComponentProps, prevState: IMapComponentState): void {
        if (prevState.viewport.latitude !== this.state.viewport.latitude) {
            this.handleViewChange();
        }
        if (this.shouldComputeClusters(prevProps, this.props)) {
            this.computeCustersKmeans();
        }
    }

    public setViewport(newViewport: ViewState): void {
        const viewport: IViewport = {
            // width: this.state.viewport.width,
            // height: this.state.viewport.height,
            latitude: newViewport.latitude,
            longitude: newViewport.longitude,
            zoom: newViewport.zoom,
        };
        this.setState({ viewport });
    }

    // public getEventHandlers(): any {
    //     return {
    //       onClick: (properties: any, coords: any, offset: any) =>
    //         console.log("marker click", properties),
    //       onMouseEnter: (properties: any, coords: any, offset: any) =>
    //         console.log(
    //           `Receive event onMouseEnter at properties: ${properties}, coords: ${coords}, offset: ${offset}`
    //         ),
    //       onMouseLeave: (properties: any, coords: any, offset: any) =>
    //         console.log(
    //           `Receive event onMouseLeave at properties: ${properties}, coords: ${coords}, offset: ${offset}`
    //         ),
    //       onClusterClick: (properties: any, coords: any, offset: any) =>
    //         console.log(
    //           `Receive event onClusterClick at properties: ${properties}, coords: ${coords}, offset: ${offset}`
    //         )
    //     };
    // }

    public onTileChange = (tile: string): void => {
        this.setState({
            tile,
        });
    }

    public render(): JSX.Element {
        const viewport: IViewport = {
            // width: this.props.mapDimensions.width,
            // height: this.props.mapDimensions.height,
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
                    onViewportChange={(viewport: ViewState): void => this.setViewport(viewport)}
                    mapboxApiAccessToken={TOKEN}
                >
                    {this.getMarkersOrCluster()}
                    <div style={{position: "absolute", left: 10, top: 10}}>
                    <TileSelector
                        tile={this.state.tile}
                        onTileChange={this.onTileChange}
                    />
                    </div>
                </ReactMapGL>
            </div>
        );
    }
}
