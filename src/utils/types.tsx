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
}

export interface IHistory {
    time: string;
    flow: number;
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
    extra_field?: string;
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
    email: string;
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

export interface IUserProfile {
    name: string;
    avatar: string;
    creationDate: string;
}

export interface IUser extends IUserProfile {
    favourites: string[];
    email: string;
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

export interface ILogEntry {
    _id: string;
    date: string;
    participantCount: number;
    rating: number;
    description: string;
    section: string;
}

export interface IErrors {
    data: {
        password: boolean;
        newPassword: boolean;
        newPassword2: boolean;
        email: boolean;
    };
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
