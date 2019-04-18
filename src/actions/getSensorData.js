import axios from "axios";

import {
    GET_SENSOR_DATA
} from "./types";

const serverLocation = process.env.REACT_APP_RIVER_SERVICE_URL;

export const getSensorData = () => dispatch => {
    console.log("URL = ", serverLocation);
    const request = {
        action: "get_features",
        crossDomain: true,
    }

    axios
        .post(serverLocation, request)
        .then(res => {
            dispatch({
                type: GET_SENSOR_DATA,
                payload: res,
            });
        })
};
