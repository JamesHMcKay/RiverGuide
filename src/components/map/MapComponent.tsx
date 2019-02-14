import React, { Component } from "react";
import MapGL, { Marker, FlyToInterpolator, ViewState } from "react-map-gl";
import 'mapbox-gl/dist/mapbox-gl.css';
import MapMarker from './MapMarker';
import MapCluster from './MapCluster';
import * as kmeans from 'node-kmeans';
import WebMercatorViewport from 'viewport-mercator-project';
import { IGuide, IMapBounds, ILatLon } from '../../utils/types';
import { IMapDimensions } from '../Panel';
import { IViewport } from "./InfoMapComponent";

const DEFAULT_LAT = -41.838875;
const DEFAULT_LON = 171.7799;
const DEFAULT_ZOOM = 6;

const TOKEN =
    "pk.eyJ1IjoiamhtY2theTkzIiwiYSI6ImNqbXZ0bnp6dzA3NG0zc3BiYjMxaWJrcTIifQ.BKESeoXyOqkiB8j1sjbxQg";

interface IMapComponentProps {
    guides: IGuide[];
    filteredGuides: IGuide[];
    onClick: (guide: IGuide) => void;
    setMapBounds: (bounds: IMapBounds) => void;
    mapDimensions: IMapDimensions;
}

interface IMapComponentState {
    viewport: IViewport;
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

export class MapComponent extends Component<IMapComponentProps, IMapComponentState> {
    prevZoom: number = 0;
    prevMarkerSize: number = 0;
    clusterLocations: ICluster[] = [];
    mapRef?: any = undefined;

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

    getRegion = (guide: IGuide): string => {
        return guide.region;
    }

    onlyUnique = (value: string, index: number, self: any): boolean => {
        return self.indexOf(value) === index;
    }

    getViewportSpan(): number {
        if (this.mapRef) {
            let mapBounds = this.mapRef.getMap().getBounds();
            let upperLat = mapBounds._ne.lat;
            let upperLon = mapBounds._ne.lng;
            let lowerLat = mapBounds._sw.lat;
            let lowerLon = mapBounds._sw.lng;
    
            let span = this.getProximity(
                {lat: upperLat, lng: upperLon},
                {lat: lowerLat, lng: lowerLon}
            )
            return span;
        } else {
            return 1000;
        }
    }

    getProximity(markerOne: ILatLon, markerTwo: ILatLon) {
        let lat1 = markerOne.lat;
        let lat2 = markerTwo.lat;
        let lon1 = markerOne.lng || markerOne.lon || 0;
        let lon2 = markerTwo.lng || markerTwo.lon || 0;
        var R = 6371e3;
        var phi1 = lat1 * (Math.PI / 180);
        var phi2 = lat2 * (Math.PI / 180);
        var deltaPhi = (lat2-lat1)*(Math.PI / 180);
        var deltaLambda = (lon2 - lon1)*(Math.PI / 180);
        var a = Math.sin(deltaPhi/2) * Math.sin(deltaPhi/2) +
                Math.cos(phi1) * Math.cos(phi2) *
                Math.sin(deltaLambda/2) * Math.sin(deltaLambda/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        return d;
    }

    createClusters(result: IKMeansCluster[]): ICluster[] {
        let clusterLocations = [];
        let guides = this.props.guides;
        for (let cluster of result) {
            let markers: IGuide[] = [];
            let clusterInd = cluster.clusterInd;
            let boundingBox: Partial<IBoundingBox> = {};
            for (let ind of clusterInd) {
                let marker: IGuide = guides[ind];
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
                markers: markers,
                count: clusterInd.length,
                averageLat: cluster.centroid[0],
                averageLon: cluster.centroid[1],
            });
        }
        return clusterLocations;
    }

    computeCustersKmeans(): void {
        let numberOfClusters: number = 20;

        let guides: IGuide[] = this.props.guides;
        let locations: (number | undefined)[][] = [];

        for (let i = 0 ; i < guides.length ; i++) {
        locations.push([ guides[i].lat , guides[i].lng]);
        }
        if (locations.length < numberOfClusters) {
            numberOfClusters = locations.length;
        }
        if (locations.length === 0) {
            return;
        }

        kmeans.clusterize(locations, {k: numberOfClusters}, (err: any,res: any) => {
        if (err) console.error(err);
        else {
            let clusters = this.createClusters(res);
            this.setState({clusterLocations: clusters});
        }
        });
    }

    getMarkersOrCluster() {
        if (this.state.viewport.zoom < 7.5) {
            return this.getClusters();
        } else {
            return this.getMarkers();
        }
    }

    onClusterClick(cluster: ICluster) {
        let boundingBox = cluster.boundingBox;
        const {longitude, latitude, zoom} = new WebMercatorViewport(this.state.viewport)
        .fitBounds([[boundingBox.minLon, boundingBox.minLat], [boundingBox.maxLon, boundingBox.maxLat]], {
          padding: 5,
          offset: [0, 0]
        });
        const viewport = {
            ...this.state.viewport,
            longitude,
            latitude,
            zoom,
            transitionDuration: 5000,
            transitionInterpolator: new FlyToInterpolator()
        }
        this.setState({viewport});
    }

    getClusters() {
        let clusters = this.state.clusterLocations;
        if (!clusters) {
            clusters = [];
        }
        let list = clusters.map(
            cluster =>
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
                            onClick={() => this.onClusterClick(cluster)}
                        />
                    </Marker>
                )
        );
        return list;
    }

    getMarkers() {
        let list = this.props.filteredGuides.map(
            guide =>
                guide.lat &&
                guide.lng && (
                    <Marker 
                        key={guide.lat}
                        longitude={guide.lng}
                        latitude={guide.lat}
                    >
                        <MapMarker 
                            size={30}
                            onClick={() => {this.props.onClick(guide)}}
                            toolTip={guide.title}
                            deleteMode={false}
                        />
                  </Marker>
                )
        );
        return list;
    }

    componentDidMount() {
        // this.element = ReactDOM.findDOMNode(this);
    }

    handleViewChange() {
        if (this.mapRef) {
            this.props.setMapBounds(this.mapRef.getMap().getBounds());
        }
    }

    shouldComputeClusters(prevProps: IMapComponentProps, props: IMapComponentProps) {
        if (!prevProps.guides && props.guides) {
            return true;
        } else if (prevProps.guides && props.guides && prevProps.guides.length !== props.guides.length ){
            return true;
        } else if (!this.state.clusterLocations || this.state.clusterLocations.length === 0) {
            return true;
        } else {
            return false;
        }
    }

    componentDidUpdate(prevProps: IMapComponentProps, prevState: IMapComponentState) {
        if (prevState.viewport.latitude !== this.state.viewport.latitude) {
            this.handleViewChange();
        }
        if (this.shouldComputeClusters(prevProps, this.props)) {
            this.computeCustersKmeans();
        }
    }

    setViewport(newViewport: ViewState): void {
        let viewport: IViewport = {
            width: this.state.viewport.width,
            height: this.state.viewport.height,
            latitude: newViewport.latitude,
            longitude: newViewport.longitude,
            zoom: newViewport.zoom,
        };
        this.setState({ viewport });
    }

    render() {
        let viewport: IViewport = {
            width: this.props.mapDimensions.width,
            height: this.props.mapDimensions.height,
            latitude: this.state.viewport.latitude,
            longitude: this.state.viewport.longitude,
            zoom: this.state.viewport.zoom
        };
        
        return (
            <MapGL
                ref={map => this.mapRef = map}
                mapStyle="mapbox://styles/mapbox/outdoors-v9"
                {...viewport}
                onViewportChange={viewport => this.setViewport(viewport)}
                mapboxApiAccessToken={TOKEN}
            >
                {this.getMarkersOrCluster()}
            </MapGL>
        );
    }
}
