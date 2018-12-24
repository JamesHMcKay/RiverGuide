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

export interface IUser {
    favourites: IGuide[];
}

export interface IAuth {
    isAuthenticated: boolean;
    user: any;
}

export interface ILatLon {
    lat: number;
    lon?: number;
    lng?: number;
}