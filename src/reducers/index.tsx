import { combineReducers } from "redux";
import modalReducer from "./modalReducer";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import guideReducer from "./guideReducer";
import gaugeReducer from "./gaugeReducer";
import logReducer from "./logReducer";
import filterReducer from "./filterReducer";
import listReducer from "./listReducer";
import infoReducer from "./infoReducer";
import openLogReducer from "./openLogReducer";
import categoryReducer from "./categoryReducer";
import mapBoundsReducer from "./mapBoundsReducer";

import { IGuide, IInfoPage, IFilter, IAuth } from "../utils/types";
import { IMapBounds } from "../models";

export interface State {
    guides: IGuide[];
    gauges: any;
    infoPage: IInfoPage,
    filteredList: IGuide[],
    filteredGuides: IFilter[],
    auth: IAuth;
    openModal: string;
    mapBounds: IMapBounds;
    openLog: boolean;
    category: string;
}

export default combineReducers({
    openModal: modalReducer,
    auth: authReducer,
    errors: errorReducer,
    guides: guideReducer,
    gauges: gaugeReducer,
    log: logReducer,
    filteredGuides: filterReducer,
    filteredList: listReducer,
    infoPage: infoReducer,
    openLog: openLogReducer,
    category: categoryReducer,
    mapBounds: mapBoundsReducer
});

