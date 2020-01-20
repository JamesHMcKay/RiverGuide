import axios from "axios";
import { openInfoPage } from "./getGuides";

import {
    GET_GAUGES,
    GET_GAUGE_DISCLAIMER,
    CLEAR_GAUGE_DISCLAIMER,
    APPEND_ENTRIES,
    GENERATE_FILTERED_LIST_APPEND,
} from "./types";

const riverServiceUrl = process.env.REACT_APP_RIVER_SERVICE_URL;
const rapidsApiUrl = process.env.REACT_APP_RAPIDS_API_URL;

export const makeGaugeRequest = (generateList, filters, mapBounds, cancelToken, guideId) => dispatch => {
    const request = {
        action: "get_features",
        filters: ["flow", "rainfall", "stage_height"],
        crossDomain: true,
    }
    axios
        .post(riverServiceUrl, request)
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
                    activity: "data",
                    source: item.data_source,
                    river_name: item.river_name,
                    lastUpdated: item.last_updated,
                }));
            dispatch({
                type: GET_GAUGES,
                payload: result,
            });
            if (generateList) {
                dispatch({
                    type: APPEND_ENTRIES,
                    payload: result,
                });
                if (guideId) {
                    const selectedGuide = result.filter(item => item.id === guideId);
                    selectedGuide.length > 0 && dispatch(openInfoPage(selectedGuide[0]));
                }
                dispatch({
                    type: GENERATE_FILTERED_LIST_APPEND,
                    payload: {
                        entries: result,
                        filters,
                        mapBounds,
                    },
                });
            }
        });
};

export const getGaugeDisclaimer = (agencyName) => dispatch => {
    dispatch({
        type: CLEAR_GAUGE_DISCLAIMER,
    });
    axios
    .get(`${rapidsApiUrl}graphql`,
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
