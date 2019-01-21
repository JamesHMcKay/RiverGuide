import { string } from "prop-types";

export interface IMarker {
    title: string;
}

export interface IGradeRange {
    from: string;
    to: string;
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
    markers: IMarker[],
    flowSpecificGrades?: IGradeRange[],
    lat?: number,
    lng?: number,
    description: string,
    dateCreated: Date;
}

export interface IGauge {
    siteName: string;
    currentFlow: number;
    currentLevel: number;
}


export interface IInfoPage {
    selectedGuide: IGuide,
    infoSelected: boolean,
    history: IGuide[],
    selectedHistory: IGuide[],
}

export interface IFilter {
    attribute: string,
    values: string,
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

export interface IUser {
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