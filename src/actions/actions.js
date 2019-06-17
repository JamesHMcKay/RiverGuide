import axios from "axios";

import {
    APPEND_GUIDES,
    CLEAR_ERRORS,
    CLOSE_MODAL,
    DELETE_LOG,
    OPEN_MODAL,
    SEARCH_GUIDES,
    FILTER_GUIDES,
    GENERATE_FILTERED_LIST,
    CLOSE_INFO,
    UPDATE_OPEN_LOG,
    ADD_TO_FAVOURITES,
    REMOVE_FROM_FAVOURITES,
    SET_MAP_BOUNDS,
    SET_FILTER,
    GET_GAUGE_HISTORY,
    CLEAR_GAUGE_HISTORY,
    GENERATE_FILTERED_LOG_LIST,
    SET_LOG_GUIDE_NAMES,
    SET_SELECTED_LOG_ID,
    GET_LOGS,
    OPEN_LOG_PAGE,
    SET_TAB_INDEX,
} from "./types";

const serverLocation = process.env.REACT_APP_SERVER_URL;
const riverServiceLocation = process.env.REACT_APP_RIVER_SERVICE_URL;
const strapi_location = "https://rapidsapi.herokuapp.com/graphql";

const riverapiLocation = 'https://rapidsapi.herokuapp.com/';

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

// Get guides
export const makeGuideRequest = category => dispatch => {
    console.log("makeGuideRequest no longer in operation");
};

// Create guides
export const createGuide = (guideData, category) => dispatch => {
    axios
        .post(`${serverLocation}/${category}`, guideData)
        .then(res => {
            dispatch({
                type: CLOSE_MODAL,
                payLoad: "createModal",
            });
            dispatch({
                type: OPEN_MODAL,
                payload: "successModal",
            });
            dispatch({
                type: APPEND_GUIDES,
                payload: res.data,
            });
        })
        .catch(err => {
        });
};

// Get logbook logs
export const makeLogbookRequest = (user_id) => dispatch => {
    //let query = "{logs(user_id:\"" + user_id + "\"){log_id, user_id, date, participants, rating, description, guide_id, public, observables, weather}}"
    let req = [
        axios.get(riverapiLocation + "logs",
        {
            //params: {query: query},
        }),
        axios
        .get(`${strapi_location}`,
            {
                headers: {'Authorization': ''},
                params: {query: '{wwguides(limit:999){id,river_name,section_name,region,latitude,longitude,gauge_id}}'},
            }
        )
      ];

      Promise.all(req).then((res) => {
        let logs = res[0].data.map(item => ({
            ...item,
            log_id: item.id,
        }));

        let data = res[1].data.data.wwguides;
        let result = data.map(item => (
            {
                id: item.id,
                display_name: item.section_name,
                river_name: item.river_name,
                position: {lat: item.latitude < 90 ? item.latitude : -45, lon: item.longitude },
                region: item.region,
                gauge_id: item.gauge_id,
                type: "wwguide",
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

// search guide list
export const searchGuideList = searchString => dispatch => {
    dispatch({
        type: SEARCH_GUIDES,
        payload: searchString,
    });
};

// set map bounds
export const setMapBounds = mapBounds => dispatch => {
    dispatch({
        type: SET_MAP_BOUNDS,
        payload: mapBounds,
    });
};

// filter guide list
export const filterGuideList = (attribute, values) => dispatch => {
    dispatch({
        type: FILTER_GUIDES,
        payload: {
            attribute,
            values,
        },
    });
};

export const generateFilteredList = (entries, searchString, mapBounds, isLogList) => dispatch => {
    if (isLogList) {
        dispatch({
            type: GENERATE_FILTERED_LOG_LIST,
            payload: {
                entries,
                searchString,
            },
        });
    } else {
        dispatch({
            type: GENERATE_FILTERED_LIST,
            payload: {
                entries,
                searchString,
                mapBounds,
            },
        });
    }

    dispatch({
        type: SET_FILTER,
        payload: {
            searchString,
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
            .post(riverServiceLocation, request)
            .then(res => {
                let data = res.data.flows;
                let result = data.map(item => (
                    {
                        flow: item.flow,
                        time: item.time,
                        values: {
                            flow: item.flow,
                            stage_height: item.stage_height,
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
    axios.post(riverapiLocation + "logs", logEntry).then(res => {
        // dispatch({
        //     type: APPEND_LOGS,
        //     payload: res.data,
        // });
        dispatch({
            type: CLOSE_MODAL,
        });
    });
};

// Edit logbook entry
export const editLogEntry = updatedLogEntry => dispatch => {
    axios
        .put(
            riverapiLocation + "logs/" + updatedLogEntry.log_id,
            updatedLogEntry,
        )
        .then(res => {
            // dispatch({
            //     type: EDIT_LOG,
            //     payload: res.data,
            // });
            dispatch({
                type: CLOSE_MODAL,
            });
        });
};

// Delete logbook entry
export const deleteLogEntry = logId => dispatch => {
    axios.delete(riverapiLocation + "logs/" + logId).then(res => {
        dispatch({
            type: DELETE_LOG,
            payload: logId,
        });
    });
};

// add to favourites
export const addToFavourites = (guideId, email) => dispatch => {
    axios
        .put(`${serverLocation}/users/current/add-favourite/${guideId}`, {
            email,
        })
        .then(res => {
            dispatch({
                type: ADD_TO_FAVOURITES,
                payload: guideId,
            });
        })
        .catch(err => console.log(err));
};

// remove from favourites
export const removeFromFavourites = (guideId, email) => dispatch => {
    axios
        .delete(`${serverLocation}/users/current/delete-favourite/${guideId}`, {
            email,
        })
        .then(res =>
            dispatch({
                type: REMOVE_FROM_FAVOURITES,
                payload: guideId,
            }),
        )
        .catch(err => console.log(err));
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