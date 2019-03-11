import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import {
    APPEND_GUIDES,
    APPEND_LOGS,
    CLEAR_ERRORS,
    CLOSE_MODAL,
    DELETE_LOG,
    EDIT_LOG,
    GET_ERRORS,
    GET_GUIDES,
    OPEN_MODAL,
    SET_CURRENT_USER,
    GET_GAUGES,
    GET_LOGS,
    SEARCH_GUIDES,
    FILTER_GUIDES,
    GENERATE_FILTERED_LIST,
    OPEN_INFO,
    CLOSE_INFO,
    ADD_HISTORIC_FLOW,
    GET_GAUGE_HISTORY,
    UPDATE_OPEN_LOG,
    SET_CATEGORY,
    LOADING_GUIDES,
    ADD_TO_FAVOURITES,
    REMOVE_FROM_FAVOURITES,
    SET_MAP_BOUNDS,
} from "./types";

const serverLocation = process.env.REACT_APP_SERVER_URL;

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

// Register User
export const registerUser = (userData) => dispatch => {
    axios
        .post(serverLocation + "/users/register", userData)
        .then(res => {
            dispatch({
                type: CLOSE_MODAL,
                payload: "registerModal",
            });
            dispatch({ type: CLEAR_ERRORS });
            dispatch({
                type: OPEN_MODAL,
                payload: "welcomeModal",
            });
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response,
            });
            dispatch({
                type: OPEN_MODAL,
                payload: "registerModal",
            });
        });
};

// Login - Get User Token
export const loginUser = userData => dispatch => {
    axios
        .post(serverLocation + "/users/login", userData)
        .then(res => {
            // Save to localStorage
            const { token } = res.data;
            // Set token to ls
            localStorage.setItem("jwtToken", token);
            // Set token to Auth header
            setAuthToken(token);
            // Decode token to get user data
            const decoded = jwt_decode(token);
            // Set current user
            dispatch(setCurrentUser(decoded));
            dispatch({
                type: CLOSE_MODAL,
                payload: "loginModal",
            });
            dispatch({ type: CLEAR_ERRORS });
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response,
            });
            dispatch({
                type: OPEN_MODAL,
                payload: "loginModal",
            });
        });
};

// Set logged in user
export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded,
    };
};

// Log user out
export const logoutUser = () => dispatch => {
    // Remove token from localstorage
    localStorage.removeItem("jwtToken");
    // Remove auth header for future requests
    setAuthToken(false);
    // Set current user to {} & isAuthenticated false
    dispatch(setCurrentUser({}));
};

// Change user password
export const changePassword = userData => dispatch => {
    axios
        .put(serverLocation + "/users/login", userData)
        .then(res => {
            dispatch({
                type: CLOSE_MODAL,
                payload: "changePasswordModal",
            });
            dispatch({ type: CLEAR_ERRORS });
            dispatch({
                type: OPEN_MODAL,
                payload: "successModal",
            });
        })
        .catch(err => {
            dispatch({
                type: GET_ERRORS,
                payload: err.response,
            });
            dispatch({
                type: OPEN_MODAL,
                payload: "changePasswordModal",
            });
        });
};

// Get guides
export const makeGuideRequest = category => dispatch => {
    axios
        .get(`${serverLocation}/${category}`)
        .then(res => {
            dispatch({
                type: GET_GUIDES,
                payload: res.data,
            });
        })
        .catch(err => console.log(err));
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

// Get gauges
export const makeGaugeRequest = () => dispatch => {
    axios.get(process.env.REACT_APP_AGG_FLOW_URL).then(res => {
        dispatch({
            type: GET_GAUGES,
            payload: res.data.data,
        });
    });
};

// Get logbook logs
export const makeLogbookRequest = () => dispatch => {
    axios.get(serverLocation + "/logbook").then(res => {
        dispatch({
            type: GET_LOGS,
            payload: res.data,
        });
    });
};

// Create logbook entry
export const createLogEntry = logEntry => dispatch => {
    axios.post(serverLocation + "/logbook", logEntry).then(res => {
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

export const generateFilteredList = (guides, filters, mapBounds) => dispatch => {
    dispatch({
        type: GENERATE_FILTERED_LIST,
        payload: {
            guides,
            filters,
            mapBounds,
        },
    });
};

// open info page
export const openInfoPage = guide => dispatch => {
    dispatch({
        type: OPEN_INFO,
        payload: {
            selectedGuide: guide,
            infoSelected: true,
        },
    });

    // check for gauge data
    if (guide.gaugeName) {
        axios
            .get(
                `${process.env.REACT_APP_AGG_FLOW_URL}/${
                    guide.gaugeName
                }/history`,
            )
            .then(res => {
                dispatch({
                    type: ADD_HISTORIC_FLOW,
                    payload: res.data.data,
                });
            })
            .then(() => dispatch({ type: CLEAR_ERRORS }));
    }
};

export const getGaugeHistory = guide => dispatch => {
    // check for gauge data
    console.log("getting gauge history for gauge = ", guide.gaugeName);
    if (guide.gaugeName) {
        axios
            .get(
                `${process.env.REACT_APP_AGG_FLOW_URL}/${
                    guide.gaugeName
                }/history`,
            )
            .then(res => {
                dispatch({
                    type: GET_GAUGE_HISTORY,
                    payload: res.data.data,
                });
            })
            .then(() => dispatch({ type: CLEAR_ERRORS }));
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

// Set category
export const setCategory = category => dispatch => {
    dispatch({
        type: LOADING_GUIDES,
    });
    dispatch({
        type: CLOSE_INFO,
    });

    axios
        .get(`${serverLocation}/${category}`)
        .then(res => {
            dispatch({
                type: GET_GUIDES,
                payload: res.data,
            });
        })
        .catch(err => console.log(err));

    dispatch({
        type: SET_CATEGORY,
        payload: category,
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
