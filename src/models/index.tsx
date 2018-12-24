export interface ILatLon {
    lat: number;
    lon?: number;
    lng?: number;
}


export interface IMapBounds {
    _ne: ILatLon;
    _sw: ILatLon;
}

export interface IMarker {
    name: string,
    lat: number,
    lng: number,
    id: string,
}