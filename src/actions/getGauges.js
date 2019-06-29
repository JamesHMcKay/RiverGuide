import axios from "axios";

import {
    GET_GAUGES
} from "./types";

const serverLocation = process.env.REACT_APP_RIVER_SERVICE_URL;

export const makeGaugeRequest = () => dispatch => {

    const request = {
        action: "get_features",
        filters: ["flow"],
        crossDomain: true,
    }
    axios
        .post(serverLocation, request)
        .then(res => {
            let data = res.data.features;
            let result = data.map(item => (
                {
                    id: item.id,
                    gauge_id: item.id,
                    display_name: item.name,
                    position: {lat: item.location.lat, lon: item.location.lon },
                    observables: item.observables,
                    region: item.data_source,
                    type: "gauge",
                    source: item.data_source,
                    lastUpdated: "Date to come",
                }));
            dispatch({
                type: GET_GAUGES,
                payload: result,
            });
        });
};
