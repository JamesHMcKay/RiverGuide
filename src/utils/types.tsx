import { IWeather } from "../components/infoPanel/WeatherStore";

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
    name: string;
    lat: number;
    lng: number;
    id: string;
    description: string;
    category: string;
}

// export interface IMarker {
//     name: string;
//     lat: number;
//     lng: number;
//     id: string;
// }

export interface IGradeRange {
    from: string;
    to: string;
}

export interface IFlowLevel {
    currentFlow: string;
    currentLevel: string;
}

export interface IObsValue {
    stage_height: number;
    flow: number;
    temperature: number;
}

export interface IHistory {
    time: string;
    values: Partial<IObsValue>;
}

export interface IObservable {
    latest_value: number;
    type: string;
    units: string;
}

export interface IListEntry {
    id: string;
    display_name: string;
    river_name?: string;
    region: string;
    gauge_id?: string;
    position: ILatLon;
    observables?: IObservable[];
    latest_flow?: number;
    type: string;
}

export interface IWhiteWaterDetails {
    entryDetails: string;
    exitDetails: string;
    gradeHardest: string;
    gradeOverall: string;
    markerList: IMarker[];
}

export interface IItemDetails extends Partial<IWhiteWaterDetails> {
    id: string;
    description: string;
}

export interface IGuide {
    _id: string;
    author: string;
    title: string;
    river: string;
    region: string;
    gaugeName?: string;
    grade?: string;
    minFlow?: number;
    maxFlow?: number;
    markers: IMarker[];
    flowSpecificGrades?: IGradeRange[];
    lat?: number;
    lng?: number;
    description: string;
    dateCreated: Date;
    catch_type?: string;
    activity?: string;
    latestFlow?: number;
}

export interface IGauge extends IListEntry {
    observables: IObservable[];
}

export interface IGaugeHistory {
    gaugeHistory: IHistory[];
}

export interface IInfoPage {
    selectedGuide: IListEntry;
    infoSelected: boolean;
    history: IHistory[];
    selectedHistory: IHistory[];
    itemDetails: IItemDetails;
}

export interface IFilter {
    searchString: string;
}

export interface ILoginDetails {
    identifier: string;
    password: string;
}

export interface IRegisterData {
    name: string;
    email: string;
    password: string;
    password2: string;
}

export interface IUserData extends ILoginDetails {
    newPassword: string;
    newPassword2: string;
}

export interface IOpenLog {
    _id: string;
}

export interface IUser {
    email: string;
    username: string;
    createdAt: string;
    id: string;
    provider: string;
}

export interface IAuth {
    isAuthenticated: boolean;
    user: IUser;
}

export interface ILatLon {
    lat: number;
    lon?: number;
    lng?: number;
}

export interface ILogComplete extends ILogListItem, ILogEntry {}

export interface ILogListItem extends ILogBase {
    guide_name: string;
    flow: string;
}

export interface ILogEntry extends ILogBase {
    user_id: string;
    observables?: IObsValue;
    weather?: IWeather;
    public: boolean;
    description: string;
}

export interface ILogBase {
    log_id: string;
    guide_id: string;
    date: string;
    participants: number;
    rating: number;
}

export interface IErrors {
    message: string;
}

export enum IThemeColor {
    primary = "primary",
    secondary = "secondary",
}

export interface ISensorFeatureRequest {
    action: string;
}

export interface IFeatureOfInterest {
    id: string;
    latest_flow: number;
    name: string;
}

export interface IRiverRegion {
    river: string;
    region: string;
}
