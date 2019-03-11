import "mapbox-gl/dist/mapbox-gl.css";
import * as kmeans from "node-kmeans";
import React, { Component } from "react";
import ReactMapGL, { FlyToInterpolator, InteractiveMap, Marker, ViewState } from "react-map-gl";
import WebMercatorViewport from "viewport-mercator-project";
import { IGuide, ILatLon, IMapBounds } from "../../utils/types";
import { IMapDimensions } from "../Panel";
import { IViewport } from "./InfoMapComponent";
import MapCluster from "./MapCluster";
import MapMarker from "./MapMarker";

const DEFAULT_LAT: number = -41.838875;
const DEFAULT_LON: number = 171.7799;
const DEFAULT_ZOOM: number = 6;

const TOKEN: string =
    "pk.eyJ1IjoiamhtY2theTkzIiwiYSI6ImNqbXZ0bnp6dzA3NG0zc3BiYjMxaWJrcTIifQ.BKESeoXyOqkiB8j1sjbxQg";

interface IMapComponentProps {
    guides: IGuide[];
    filteredGuides: IGuide[];
    onClick: (guide: IGuide) => void;
    setMapBounds: (bounds: IMapBounds) => void;
    mapDimensions: IMapDimensions;
}

interface IMapComponentState {
    viewport: IViewportWithTransition;
    clusterLocations: ICluster[];
}

interface ICluster {
    boundingBox: IBoundingBox;
    lat: number;
    lon: number;
    markers: IGuide[];
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

interface IViewportWithTransition extends IViewport {
    transitionDuration?: number;
    transitionInterpolator?: FlyToInterpolator;
}

export class MapComponent extends Component<IMapComponentProps, IMapComponentState> {
    public prevZoom: number = 0;
    public prevMarkerSize: number = 0;
    public clusterLocations: ICluster[] = [];
    public mapRef?: any = undefined;

    constructor(props: IMapComponentProps) {
        super(props);
        this.state = {
            viewport: {
                width: this.props.mapDimensions.width,
                height: this.props.mapDimensions.height,
                latitude: DEFAULT_LAT,
                longitude: DEFAULT_LON,
                zoom: DEFAULT_ZOOM,
            },
            clusterLocations: [],
        };
        this.computeCustersKmeans();
    }

    public getRegion = (guide: IGuide): string => {
        return guide.region;
    }

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
        const guides: IGuide[] = this.props.guides;
        for (const cluster of result) {
            const markers: IGuide[] = [];
            const clusterInd: number[] = cluster.clusterInd;
            const boundingBox: Partial<IBoundingBox> = {};
            for (const ind of clusterInd) {
                const marker: IGuide = guides[ind];
                markers.push(marker);
                if (marker && marker.lat && marker.lng) {
                    if (!boundingBox.maxLat || marker.lat > boundingBox.maxLat) {
                        boundingBox.maxLat = marker.lat;
                    }
                    if (!boundingBox.maxLon || marker.lng > boundingBox.maxLon) {
                        boundingBox.maxLon = marker.lng;
                    }

                    if (!boundingBox.minLon || marker.lng < boundingBox.minLon) {
                        boundingBox.minLon = marker.lng;
                    }
                    if (!boundingBox.minLat || marker.lat < boundingBox.minLat) {
                        boundingBox.minLat = marker.lat;
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
        let numberOfClusters: number = 20;

        const guides: IGuide[] = this.props.guides;
        const locations: Array<Array<number | undefined>> = [];

        for (const guide of guides) {
            locations.push([ guide.lat , guide.lng]);
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
        const {longitude, latitude, zoom} = new WebMercatorViewport(this.state.viewport)
        .fitBounds([[boundingBox.minLon, boundingBox.minLat], [boundingBox.maxLon, boundingBox.maxLat]], {
          padding: 5,
          offset: [0, 0],
        });
        const viewport: IViewportWithTransition = {
            ...this.state.viewport,
            longitude,
            latitude,
            zoom,
            transitionDuration: 5000,
            transitionInterpolator: new FlyToInterpolator(),
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
                    key={cluster.lat}
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

    public getMarkers(): Array<(0 | JSX.Element | undefined)> {
        const list: Array<(0 | JSX.Element | undefined)>  = this.props.filteredGuides.map(
            (guide: IGuide) =>
                guide.lat &&
                guide.lng && (
                    <Marker
                        key={guide.lat}
                        longitude={guide.lng}
                        latitude={guide.lat}
                    >
                        <MapMarker
                            size={30}
                            onClick={(): void => {this.props.onClick(guide); }}
                            toolTip={guide.title}
                            deleteMode={false}
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
            width: this.state.viewport.width,
            height: this.state.viewport.height,
            latitude: newViewport.latitude,
            longitude: newViewport.longitude,
            zoom: newViewport.zoom,
        };
        this.setState({ viewport });
    }

    public render(): JSX.Element {
        const viewport: IViewport = {
            width: this.props.mapDimensions.width,
            height: this.props.mapDimensions.height,
            latitude: this.state.viewport.latitude,
            longitude: this.state.viewport.longitude,
            zoom: this.state.viewport.zoom,
        };

        return (
            <ReactMapGL
                ref={(map: ReactMapGL | null): InteractiveMap | null => this.mapRef = map}
                mapStyle="mapbox://styles/mapbox/outdoors-v9"
                {...viewport}
                onViewportChange={(viewport: ViewState): void => this.setViewport(viewport)}
                mapboxApiAccessToken={TOKEN}
            >
                {this.getMarkersOrCluster()}
            </ReactMapGL>
        );
    }
}
