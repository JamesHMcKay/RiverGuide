import axios from "axios";
import setAuthToken from "../utils/setAuthToken";

import {
    CLEAR_ERRORS,
    CLOSE_MODAL,
    GET_ERRORS,
    OPEN_MODAL,
    SET_CURRENT_USER,
    SET_LOADING_SPINNER,
    CLEAR_LOADING_SPINNER,
} from "./types";
import parseUserObject from "../utils/parseUserObject";

const serverLocation = 'https://rapidsapi.herokuapp.com/';
const testServerLocation = 'https://rapidsapi.herokuapp.com/';

// Register User
export const registerUser = (userData) => dispatch => {
    // Request API. 
    // Add your own code here to customize or restrict how the public can register new users.
    axios
    .post(serverLocation + 'auth/local/register', {
        username: userData.name,
        email: userData.email,
        password: userData.password
    })
    .then(response => {
        // Handle success.
        console.log('Well done!');
        console.log('User profile', response.data.user);
        console.log('User token', response.data.jwt);
        localStorage.setItem("jwtToken", response.data.jwt);
        localStorage.setItem("user", JSON.stringify(parseUserObject(response.data.user)));
        setAuthToken(response.data.jwt);
        dispatch(setCurrentUser(parseUserObject(response.data.user)));

        dispatch({
            type: CLOSE_MODAL,
            payload: "registerModal",
        });
        dispatch({ type: CLEAR_ERRORS });
    })
    .catch(error => {
        // Handle error.
        console.log('An error occurred:', error);
        console.log("error response", error.response);
        dispatch({
            type: GET_ERRORS,
            payload: {message: error.response.data.message}
        });
        dispatch({
            type: OPEN_MODAL,
            payload: "registerModal",
        });
    });
};

// Login - Get User Token
export const loginUser = userData => dispatch => {

    // Request API.
    axios
    .post(serverLocation + 'auth/local/', {
        identifier: userData.identifier,
        password: userData.password,
    })
    .then(response => {
        // Handle success.
        console.log('Well done!');
        console.log('User profile', response.data.user);
        console.log('User token', response.data.jwt);

        localStorage.setItem("jwtToken", response.data.jwt);
        localStorage.setItem("user", JSON.stringify(parseUserObject(response.data.user)));
        setAuthToken(response.data.jwt);
        dispatch(setCurrentUser(parseUserObject(response.data.user)));
        dispatch({
            type: CLOSE_MODAL,
            payload: "loginModal",
        });
        dispatch({ type: CLEAR_ERRORS });
    })
    .catch(error => {
        // Handle error.
        console.log('An error occurred:', error);
        dispatch({
            type: GET_ERRORS,
            payload: {message: error.response.data.message}
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
    localStorage.removeItem("user");
    // Remove auth header for future requests
    setAuthToken(false);
    // Set current user to {} & isAuthenticated false
    dispatch(setCurrentUser({}));
    dispatch({
        type: CLOSE_MODAL,
        payload: "logoutModal",
    });
};

// Register User
export const providerLogin = (action, history) => dispatch => {
    // Request API. 
    // Add your own code here to customize or restrict how the public can register new users.
    axios
    .get(testServerLocation + `auth/${action.provider}/callback${action.search}`)
    .then(response => {
        // Handle success.
        console.log('Response recieved');
        console.log('User profile', response.data.user);
        console.log('User token', response.data.jwt);
        history.push("/");
        localStorage.setItem("jwtToken", response.data.jwt);
        localStorage.setItem("user", JSON.stringify(parseUserObject(response.data.user)));
        setAuthToken(response.data.jwt);
        dispatch(setCurrentUser(parseUserObject(response.data.user)));

        dispatch({
            type: CLOSE_MODAL,
            payload: "registerModal",
        });
        dispatch({ type: CLEAR_ERRORS });
    })
    .catch(error => {
        // Handle error.
        console.log('An error occurred:', error);
        dispatch({
            type: GET_ERRORS,
            payload: {message: error.response.data.message}
        });
        dispatch({
            type: OPEN_MODAL,
            payload: "registerModal",
        });
    });
};

export const changeUserDetails = (userDetails) => dispatch => {
    axios
    .put(serverLocation + "users/" + userDetails.id, {
        username: userDetails.username,
        email: userDetails.email,
    })
    .then(res => {
        console.log("updated user details");
    })
    .catch(err => {
    });

    dispatch(setCurrentUser(userDetails));
};

export const deleteUser = (userDetails) => dispatch => {
    dispatch({
        type: SET_LOADING_SPINNER,
        payload: "deleteAccount",
    });
    axios
    .delete(serverLocation + "users/" + userDetails.id)
    .then(res => {
        dispatch({
            type: CLEAR_LOADING_SPINNER
        });
        console.log("deleted user");
    })
    .catch(err => {
        dispatch({
            type: GET_ERRORS,
            payload: {message: err.response.data.message}
        });
        dispatch({
            type: CLEAR_LOADING_SPINNER
        });
    });

    dispatch(logoutUser());
};