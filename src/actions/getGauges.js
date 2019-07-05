import axios from "axios";

import {
    GET_GAUGES,
    GET_GAUGE_DISCLAIMER,
    CLEAR_GAUGE_DISCLAIMER
} from "./types";

const serverLocation = process.env.REACT_APP_RIVER_SERVICE_URL;
const strapi_location = "https://rapidsapi.herokuapp.com/graphql";

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
                    region: item.region,
                    type: "gauge",
                    source: item.data_source,
                    river_name: item.river_name,
                    lastUpdated: item.last_updated,
                }));
            dispatch({
                type: GET_GAUGES,
                payload: result,
            });
        });
};

export const getGaugeDisclaimer = (agencyName) => dispatch => {
    dispatch({
        type: CLEAR_GAUGE_DISCLAIMER,
    });
    axios
    .get(`${strapi_location}`,
        {
            headers: {'Authorization': ''},
            params: {query: `{agencydetails(where: {agency_name: "${agencyName}"}){disclaimer}}`},
        }
    ).then((res) => {
        dispatch({
            type: GET_GAUGE_DISCLAIMER,
            payload: res.data.data.agencydetails ? res.data.data.agencydetails[0].disclaimer : "No disclaimer available",
        });
        });
}
