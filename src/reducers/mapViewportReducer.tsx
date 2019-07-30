import {
    SET_VIEWPORT,
} from "../actions/types";
import { IViewport } from "../components/map/InfoMapComponent";

export const DEFAULT_LAT: number = -40.838875;
export const DEFAULT_LON: number = 171.7799;
export const DEFAULT_ZOOM: number = 5;

const defaultViewport: IViewport = {
    latitude: DEFAULT_LAT,
    longitude: DEFAULT_LON,
    zoom: DEFAULT_ZOOM,
};

export default function(state: IViewport = defaultViewport, action: any): IViewport {
    switch (action.type) {
        case SET_VIEWPORT:
            return action.payload;
        default:
            return state;
    }
}
