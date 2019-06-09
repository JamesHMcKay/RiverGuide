import axios from "axios";

import {
    APPEND_GUIDES,
    APPEND_LOGS,
    CLEAR_ERRORS,
    CLOSE_MODAL,
    DELETE_LOG,
    EDIT_LOG,
    OPEN_MODAL,
    GET_LOGS,
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
} from "./types";

const serverLocation = process.env.REACT_APP_SERVER_URL;
const riverServiceLocation = process.env.REACT_APP_RIVER_SERVICE_URL;

const trickleLocation = 'https://trickleapi.herokuapp.com/';

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
    axios.get(trickleLocation + "logs",
    {
        //params: {query: query},
    }).then(res => {
        console.log("got logbook", res);
        dispatch({
            type: GET_LOGS,
            payload: res.data,
        });
    });
};

// Create logbook entry
export const createLogEntry = logEntry => dispatch => {
    axios.post(trickleLocation + "logs", logEntry).then(res => {
        dispatch({
            type: APPEND_LOGS,
            payload: res.data,
        });
        dispatch({
            type: CLOSE_MODAL,
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

export const generateFilteredList = (guides, searchString, mapBounds) => dispatch => {
    dispatch({
        type: GENERATE_FILTERED_LIST,
        payload: {
            guides,
            searchString,
            mapBounds,
        },
    });

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

// Edit logbook entry
export const editLogEntry = updatedLogEntry => dispatch => {
    axios
        .put(
            serverLocation + "/logbook/" + updatedLogEntry._id,
            updatedLogEntry,
        )
        .then(res => {
            dispatch({
                type: EDIT_LOG,
                payload: res.data,
            });
            dispatch({
                type: CLOSE_MODAL,
            });
        });
};

// Delete logbook entry
export const deleteLogEntry = logId => dispatch => {
    axios.delete(serverLocation + "/logbook/" + logId).then(res => {
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
