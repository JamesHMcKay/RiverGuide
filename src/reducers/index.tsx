import { combineReducers } from "redux";
import authReducer from "./authReducer";
import categoryReducer from "./categoryReducer";
import errorReducer from "./errorReducer";
import filterReducer from "./filterReducer";
import gaugeReducer from "./gaugeReducer";
import guideReducer from "./guideReducer";
import infoReducer from "./infoReducer";
import listReducer from "./listReducer";
import logReducer from "./logReducer";
import mapBoundsReducer from "./mapBoundsReducer";
import modalReducer from "./modalReducer";
import openLogReducer from "./openLogReducer";

import {
    IAuth,
    IErrors,
    IFilter,
    IGauge,
    IGuide,
    IInfoPage,
    ILogEntry,
    IMapBounds,
    IOpenLog } from "../utils/types";

export interface IState {
    guides: IGuide[];
    gauges: IGauge[];
    infoPage: IInfoPage;
    filteredList: IGuide[];
    filteredGuides: IFilter[];
    auth: IAuth;
    openModal: string;
    mapBounds: IMapBounds;
    openLog: IOpenLog;
    category: string;
    errors: IErrors;
    log: ILogEntry[];
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
    mapBounds: mapBoundsReducer,
});
