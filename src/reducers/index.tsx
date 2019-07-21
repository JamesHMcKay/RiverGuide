import { combineReducers } from "redux";
import { WeatherStore } from "../components/infoPanel/WeatherStore";
import {
    IAuth,
    IErrors,
    IExpansionPanels,
    IFilter,
    IGauge,
    IGaugeHistory,
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
import expansionPanelsReducer from "./expansionPanelsReducer";
import filteredLogReducer from "./filteredLogReducer";
import filterReducer from "./filterReducer";
import gaugeDisclaimerReducer from "./gaugeDisclaimerReducer";
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
import recentItemsReducer from "./recentItemsReducer";
import searchPanelReducer from "./searchPanelReducer";
import selectedLogIdReducer from "./selectedLogIdReducer";
import sensorDataReducer from "./sensorDataReducer";
import tabIndexReducer from "./tabIndexReducer";
import userDetailsReducer from "./userDetailsReducer";
import weatherReducer from "./weatherReducer";

export interface IState {
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
    tabIndex: string;
    loadingSpinner: string;
    userDetails: IUserDetails;
    searchPanel: string;
    expansionPanels: IExpansionPanels;
    gaugeDisclaimer: string;
    recentItems: string[];
    guides: IListEntry[];
}

export default combineReducers({
    openModal: modalReducer,
    auth: authReducer,
    errors: errorReducer,
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
    searchPanel: searchPanelReducer,
    expansionPanels: expansionPanelsReducer,
    gaugeDisclaimer: gaugeDisclaimerReducer,
    recentItems: recentItemsReducer,
    guides: guideReducer,
});
