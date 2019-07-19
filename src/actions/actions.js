import axios from "axios";

import {
    CLEAR_ERRORS,
    CLOSE_MODAL,
    DELETE_LOG,
    OPEN_MODAL,
    GENERATE_FILTERED_LIST,
    CLOSE_INFO,
    UPDATE_OPEN_LOG,
    SET_MAP_BOUNDS,
    GET_GAUGE_HISTORY,
    CLEAR_GAUGE_HISTORY,
    SET_LOG_GUIDE_NAMES,
    SET_SELECTED_LOG_ID,
    GET_LOGS,
    OPEN_LOG_PAGE,
    SET_TAB_INDEX,
    SET_LOADING_SPINNER,
    CLEAR_LOADING_SPINNER,
    GET_ERRORS,
    EDIT_LOG,
    SET_SEARCH_PANEL,
    SET_FILTER,
    SET_EXPANSION_PANELS,
    ADD_TO_RECENTS,
} from "./types";

const riverServiceUrl = process.env.REACT_APP_RIVER_SERVICE_URL;
const rapidsApiUrl = process.env.REACT_APP_RAPIDS_API_URL;

export const setTabIndex = index => dispatch => {
    dispatch({
        type: SET_TAB_INDEX,
        payload: index,
    });
}

// Toggle Modals
export const toggleModal = modal => dispatch => {
    if (modal) {
        dispatch({
            type: OPEN_MODAL,
            payload: modal,
        });
    } else {
        dispatch({ type: CLOSE_MODAL });
        dispatch({ type: CLEAR_ERRORS });
    }
};

// Get logbook logs
export const makeLogbookRequest = (user_id) => dispatch => {
    let req = [
        axios.get(`${rapidsApiUrl}graphql`,
        {
            headers: {'Authorization': ''},
            params: {query: `query userLogs{logs(where: {user_id: ["${user_id}"]}){log_id, description, public, guide_id, description, participants, observables, start_date_time, end_date_time, username, rating, id, user_id }}`},
        }),
        axios
        .get(`${rapidsApiUrl}graphql`,
            {
                headers: {'Authorization': ''},
                params: {query: '{guides(limit:999){id,river_name,section_name,region,latitude,longitude,gauge_id,activity}}'},
            }
        )
      ];

      Promise.all(req).then((res) => {
        let logs = res[0].data.data.logs.map(item => ({
            ...item,
            log_id: item.id,
        }));

        let data = res[1].data.data.guides;
        let result = data.map(item => (
            {
                id: item.id,
                display_name: item.section_name,
                river_name: item.river_name,
                position: {lat: item.latitude < 90 ? item.latitude : -45, lon: item.longitude },
                region: item.region,
                gauge_id: item.gauge_id,
                type: item.activity,
            }));
        dispatch({
            type: SET_LOG_GUIDE_NAMES,
            payload: {logs: logs, listEntries: result},
        });
        dispatch({
            type: GET_LOGS,
            payload: {logs: logs, listEntries: result},
        });
      });
};

// set map bounds
export const setMapBounds = mapBounds => dispatch => {
    dispatch({
        type: SET_MAP_BOUNDS,
        payload: mapBounds,
    });
};

// export const setSearchString = (searchString) => dispatch => {
//     dispatch({
//         type: SET_SEARCH_STRING_FILTER,
//         payload: searchString,
//     });
// };

// export const setActivityFilter = (activity) => dispatch => {
//     dispatch({
//         type: SET_ACTIVITY_FILTER,
//         payload: activity,
//     });
// };

export const generateFilteredList = (entries, filters, mapBounds) => dispatch => {
    dispatch({
        type: SET_FILTER,
        payload: filters
    });
    dispatch({
        type: GENERATE_FILTERED_LIST,
        payload: {
            entries,
            filters,
            mapBounds,
        },
    });
};

export const getGaugeHistory = gaugeId => dispatch => {
    if (gaugeId) {
        const request = {
            action: "get_flows",
            id: [gaugeId],
            crossDomain: true,
        }
        axios
            .post(riverServiceUrl, request)
            .then(res => {
                let data = res.data.flows;
                let result = data.map(item => (
                    {
                        flow: item.flow,
                        time: item.time,
                        values: {
                            flow: item.flow,
                            stage_height: item.stage_height,
                            temperature: item.temperature,
                            rainfall: item.rainfall,
                        }
                    }));
                dispatch({
                    type: GET_GAUGE_HISTORY,
                    payload: result.reverse(),
                });
            });
    } else {
        dispatch({
            type: CLEAR_GAUGE_HISTORY
        });
    }
}

// close info page
export const closeInfoPage = () => dispatch => {
    dispatch({
        type: CLOSE_INFO,
    });
};

// Update pre-edit state
export const updateOpenLog = openLog => dispatch => {
    dispatch({
        type: UPDATE_OPEN_LOG,
        payload: openLog,
    });
};


// Create logbook entry
export const createLogEntry = logEntry => dispatch => {
    dispatch({
        type: SET_LOADING_SPINNER,
        payload: "logTrip",
    });
    axios.post(rapidsApiUrl + "logs", logEntry).then(res => {
        dispatch({
            type: CLEAR_LOADING_SPINNER,
        });
        dispatch({
            type: CLOSE_MODAL,
        });
        dispatch(makeLogbookRequest(logEntry.user_id));
    }).catch(err => {
        dispatch({
            type: GET_ERRORS,
            payload: {message: err.response.data.message}
        });
        dispatch({
            type: CLEAR_LOADING_SPINNER
        });
    });
};

// Edit logbook entry
export const editLogEntry = updatedLogEntry => dispatch => {
    dispatch({
        type: SET_LOADING_SPINNER,
        payload: "logTrip",
    });
    axios
        .put(
            rapidsApiUrl + "logs/" + updatedLogEntry.log_id,
            updatedLogEntry,
        )
        .then(res => {
            dispatch({
                type: CLEAR_LOADING_SPINNER,
            });
            dispatch({
                type: CLOSE_MODAL,
            });
            dispatch({
                type: EDIT_LOG,
                payload: updatedLogEntry,
            });
        });
};

// Delete logbook entry
export const deleteLogEntry = logId => dispatch => {
    axios.delete(rapidsApiUrl + "logs/" + logId).then(res => {
        dispatch({
            type: DELETE_LOG,
            payload: logId,
        });
        dispatch({
            type: SET_SELECTED_LOG_ID,
            payload: [],
        });
    });
};

export const setSelectedLogId = selectedLogId => dispatch => {
    dispatch({
        type: SET_SELECTED_LOG_ID,
        payload: selectedLogId,
    });
}

export const openLogPage = () => dispatch => {
    dispatch({
        type: OPEN_LOG_PAGE,
    });
}

export const setSearchPanel = (value) => dispatch => {
    dispatch({
        type: SET_SEARCH_PANEL,
        payload: value,
    });
}

export const setExpansionPanels = (expansionPanels) => dispatch => {
    dispatch({
        type: SET_EXPANSION_PANELS,
        payload: expansionPanels,
    });
}

export const addToRecents = (recentItems) => dispatch => {
    dispatch({
        type: ADD_TO_RECENTS,
        payload: recentItems,
    });
}