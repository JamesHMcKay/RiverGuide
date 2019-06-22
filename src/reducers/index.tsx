import { combineReducers } from "redux";
import { WeatherStore } from "../components/infoPanel/WeatherStore";
import {
    IAuth,
    IErrors,
    IFilter,
    IGauge,
    IGaugeHistory,
    IGuide,
    IInfoPage,
    IItemDetails,
    IListEntry,
    ILogComplete,
    IMapBounds,
    IOpenLog,
    IUserDetails } from "../utils/types";
import authReducer from "./authReducer";
import categoryReducer from "./categoryReducer";
import errorReducer from "./errorReducer";
import filteredLogReducer from "./filteredLogReducer";
import filterReducer from "./filterReducer";
import gaugeHistoryReducer from "./gaugeHistoryReducer";
import gaugeReducer from "./gaugeReducer";
import guideReducer from "./guideReducer";
import infoReducer from "./infoReducer";
import listEntryReducer from "./listEntryReducer";
import listItemDetailsReducer from "./listItemDetailsReducer";
import listReducer from "./listReducer";
import loadingSpinnerReducer from "./loadingSpinnerReducer";
import logPageOpenReducer from "./logPageOpenReducer";
import logReducer from "./logReducer";
import mapBoundsReducer from "./mapBoundsReducer";
import modalReducer from "./modalReducer";
import openLogReducer from "./openLogReducer";
import selectedLogIdReducer from "./selectedLogIdReducer";
import sensorDataReducer from "./sensorDataReducer";
import tabIndexReducer from "./tabIndexReducer";
import userDetailsReducer from "./userDetailsReducer";
import weatherReducer from "./weatherReducer";

export interface IState {
    guides: IGuide[];
    gauges: IGauge[];
    infoPage: IInfoPage;
    filteredList: IListEntry[];
    auth: IAuth;
    openModal: string;
    mapBounds: IMapBounds;
    openLog: IOpenLog;
    category: string;
    errors: IErrors;
    log: ILogComplete[];
    gaugeHistory: IGaugeHistory;
    listEntries: IListEntry[];
    listItemDetails: IItemDetails;
    weatherStore: WeatherStore;
    filters: IFilter;
    filteredLogList: ILogComplete[];
    selectedLogId: string[];
    logPageOpen: boolean;
    tabIndex: number;
    loadingSpinner: string;
    userDetails: IUserDetails;
}

export default combineReducers({
    openModal: modalReducer,
    auth: authReducer,
    errors: errorReducer,
    guides: guideReducer,
    gauges: gaugeReducer,
    log: logReducer,
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
    filters: filterReducer,
    filteredLogList: filteredLogReducer,
    selectedLogId: selectedLogIdReducer,
    logPageOpen: logPageOpenReducer,
    tabIndex: tabIndexReducer,
    loadingSpinner: loadingSpinnerReducer,
    userDetails: userDetailsReducer,
});
