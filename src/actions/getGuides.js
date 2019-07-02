import axios from "axios";

import {
    ADD_HISTORIC_FLOW,
    OPEN_INFO,
    CLOSE_INFO,
    GET_ENTRIES,
    LOADING_ENTRIES,
    GET_ITEM_DETAILS,
    GET_ITEM_LOGS,
    LOADING_LOG_ENTRIES,
    CLOSE_LOG_PAGE,
} from "./types";

const strapi_location = "https://rapidsapi.herokuapp.com/graphql";
const riverServiceLocation = process.env.REACT_APP_RIVER_SERVICE_URL;

// Set category
export const setCategory = (category, cancelToken) => dispatch => {
    dispatch({
        type: LOADING_ENTRIES,
    });
    dispatch({
        type: CLOSE_INFO,
    });

    if (category === "data") {
        const request = {
            action: "get_features",
            filters: ["flow"],
            crossDomain: true,
        }
        axios
            .post(riverServiceLocation, request, {cancelToken: cancelToken.token})
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
                        river_name: "undefined",
                        activity: "data",
                    }));
                dispatch({
                    type: GET_ENTRIES,
                    payload: result,
                });
            });
    } else {
        axios
        .get(`${strapi_location}`,
            {
                headers: {'Authorization': ''},
                params: {query: '{guides(limit:999){id,river_name,section_name,region,latitude,longitude,gauge_id, activity}}'},
                cancelToken: cancelToken.token
            }
        )
        .then(res => {
            let data = res.data.data.guides;
            let result = data.map(item => (
                {
                    id: item.id,
                    display_name: item.section_name,
                    river_name: item.river_name,
                    position: {lat: item.latitude < 90 ? item.latitude : -45, lon: item.longitude },
                    region: item.region,
                    gauge_id: item.gauge_id,
                    activity: item.activity,
                }));
            dispatch({
                type: GET_ENTRIES,
                payload: result,
            });
        })
        .catch(err => console.log(err));
    }
};

export const openLogInfoPage = guide => dispatch => {
    dispatch({
        type: LOADING_LOG_ENTRIES,
    });
    dispatch({
        type: CLOSE_LOG_PAGE,
    });

    axios
    .get(`${strapi_location}`,
        {
            headers: {'Authorization': ''},
            params: {query: `query GuideIdPublic{logs(where: {public: true guide_id_contains: ["${guide.id}"]}){log_id, description, public, guide_id, description, participants, observables, start_date_time, end_date_time, username, rating, id }}`},
        }
    ).then((res) => {
            let logs = res.data.data.logs.map(item => ({
                ...item,
                log_id: item.id,
            }));
            logs = logs.filter(item => item.guide_id === guide.id);

            dispatch({
                type: GET_ITEM_LOGS,
                payload: logs,
            });
          });
}

// open info page
export const openInfoPage = guide => dispatch => {
    dispatch({
        type: OPEN_INFO,
        payload: {
            selectedGuide: guide,
            infoSelected: true,
        },
    });
    if (guide.type === "gauge") {

    } else {
        let guideId = guide.id;
        let query = "{guide(id:\"" + guideId + "\"){description,entry_details,exit_details,marker_list,key_facts_num,key_facts_char, latitude, longitude}}"
        axios
        .get(`${strapi_location}`,
            {
                headers: {'Authorization': ''},
                params: {query: query}
            }
        )
        .then(res => {
            let item = res.data.data.guide;
            let result = 
                {
                    id: item.id,
                    entryDetails: item.entry_details,
                    exitDetails: item.exit_details,
                    description: item.description,
                    key_facts_char: item.key_facts_char,
                    key_facts_num: item.key_facts_num,
                    markerList: item.marker_list !== "" ? item.marker_list : [],
                    position: {lat: item.latitude < 90 ? item.latitude : -45, lon: item.longitude },
                };
            dispatch({
                type: GET_ITEM_DETAILS,
                payload: result,
            });
        })
        .catch(err => console.log(err));
    }

    if (guide.gauge_id) {
        const request = {
            action: "get_flows",
            id: [guide.gauge_id],
            crossDomain: true,
        }
        axios
            .post(riverServiceLocation, request)
            .then(res => {
                let data = res.data.flows;
                if (data) {
                    let result = data.map(item => (
                        {
                            time: item.time,
                            values: {
                                flow: item.flow,
                                stage_height: item.stage_height,
                            }
                        }));
                    dispatch({
                        type: ADD_HISTORIC_FLOW,
                        payload: result.reverse(),
                    });
                }
            });
    }
};


