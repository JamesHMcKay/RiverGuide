import { IWeather } from "../components/infoPanel/WeatherStore";
import { IKeyFactsChar, IKeyFactsNum } from "./keyFacts";

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
    icon?: JSX.Element;
}

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
    rainfall: number;
}

export interface IHistory {
    time: string;
    values: Partial<IObsValue>;
}

export interface IObservable {
    latest_value: number;
    type: keyof IObsValue;
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
    activity: string;
    status?: string;
}

export interface IKeyFactsNumItem {
    value: number | number[];
    unit: string;
}

export interface IKeyFactProps<T> {
    key: keyof T;
    name: string;
    icon: JSX.Element;
    activity: string;
}

export interface IItemDetails {
    id: string;
    description: string;
    entryDetails: string;
    exitDetails: string;
    markerList: IMarker[];
    key_facts_num: Partial<IKeyFactsNum>;
    key_facts_char: Partial<IKeyFactsChar>;
    position: ILatLon;
    attribution: string;
    directions: string;
    draftDetails?: IGuideDraftDetails;
}

export interface IGauge extends IListEntry {
    observables: IObservable[];
    source: string;
    lastUpdated: string;
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
    logs?: ILogComplete[];
}

export interface IFilter {
    searchString: string;
    activity: string;
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

export interface IUserDetails {
    id: string;
    user_favourites: string[];
    user_id: string;
}

export interface IUser {
    email: string;
    username: string;
    createdAt: string;
    id: string;
    provider: string;
    user_favourites: string[];
    role: string;
}

export interface IAuth {
    isAuthenticated: boolean;
    user: IUser;
}

export interface ILogComplete extends ILogListItem, ILogEntry {}

export interface ILogListItem extends ILogBase {
    guide_name: string;
    flow: string;
    stage_height: string;
    river_name: string;
}

export interface IResetPasswordDetails {
    code: string;
    password: string;
    confirmPassword: string;
}

export interface ILogEntry extends ILogBase {
    user_id: string;
    observables?: IObsValue;
    weather?: IWeather;
    public: boolean;
    description: string;
}

export interface ILogBase {
    username: string;
    log_id: string;
    id: string;
    guide_id: string;
    start_date_time: string;
    end_date_time: string;
    participants: number;
    rating: number;
}

export interface IErrors {
    message: string;
    id?: string;
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

export interface IExpansionPanels {
    description: boolean;
    keyFacts: boolean;
    map: boolean;
    logBook: boolean;
    latestData: boolean;
    flowHistory: boolean;
    flowDetails: boolean;
}

export interface IGuideDraftDetails {
    userName: string;
    userEmail: string;
    status: string;
    moderatorComments: string;
    createdAt: string;
}
