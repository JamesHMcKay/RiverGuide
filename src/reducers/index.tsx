import { combineReducers } from "redux";
import authReducer from "./authReducer";
import categoryReducer from "./categoryReducer";
import errorReducer from "./errorReducer";
import filterReducer from "./filterReducer";
import gaugeHistoryReducer from "./gaugeHistoryReducer";
import gaugeReducer from "./gaugeReducer";
import guideReducer from "./guideReducer";
import infoReducer from "./infoReducer";
import listEntryReducer from "./listEntryReducer";
import listItemDetailsReducer from "./listItemDetailsReducer";
import listReducer from "./listReducer";
import logReducer from "./logReducer";
import mapBoundsReducer from "./mapBoundsReducer";
import modalReducer from "./modalReducer";
import openLogReducer from "./openLogReducer";
import sensorDataReducer from "./sensorDataReducer";
import weatherReducer from "./weatherReducer";

import { WeatherStore } from "../components/infoPanel/WeatherStore";
import {
    IAuth,
    IErrors,
    IFeatureOfInterest,
    IFilter,
    IGauge,
    IGaugeHistory,
    IGuide,
    IInfoPage,
    IItemDetails,
    IListEntry,
    ILogEntry,
    IMapBounds,
    IOpenLog } from "../utils/types";

export interface IState {
    guides: IGuide[];
    gauges: IGauge[];
    infoPage: IInfoPage;
    filteredList: IListEntry[];
    filteredGuides: IFilter[];
    auth: IAuth;
    openModal: string;
    mapBounds: IMapBounds;
    openLog: IOpenLog;
    category: string;
    errors: IErrors;
    log: ILogEntry[];
    gaugeHistory: IGaugeHistory;
    sensorFeatureList: IFeatureOfInterest[];
    listEntries: IListEntry[];
    listItemDetails: IItemDetails;
    weatherStore: WeatherStore;
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
    gaugeHistory: gaugeHistoryReducer,
    sensorFeatureList: sensorDataReducer,
    listEntries: listEntryReducer,
    listItemDetails: listItemDetailsReducer,
    weatherStore: weatherReducer,
});
