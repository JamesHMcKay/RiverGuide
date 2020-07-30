import axios from "axios";
import { makeGaugeRequest } from "./getGauges";

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
    ADD_TO_RECENTS,
    GET_ERRORS,
    CLEAR_ERRORS,
    GENERATE_FILTERED_LIST,
    GET_GUIDES,
    GENERATE_FILTERED_LIST_APPEND,
    APPEND_ENTRIES,
} from "./types";
import { getNotices } from "./getNotices";

const riverServiceUrl = process.env.REACT_APP_RIVER_SERVICE_URL;
const rapidsApiUrl = process.env.REACT_APP_RAPIDS_API_URL;

export const makeGuideRequest = (generateList, filters, mapBounds, cancelToken, guideId) => dispatch => {
    axios
    .get(`${rapidsApiUrl}graphql`,
        {
            headers: {'Authorization': ''},
            params: {query: '{guides(limit:999){id,river_name,section_name,region,latitude,longitude,gauge_id, activity}}'},
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
            type: GET_GUIDES,
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
    })
    .catch(error => {
        dispatch({
            type: GET_ERRORS,
            payload: {message: "Request failed"}
        });
    });
};

export const updateCategory = (category, filters, mapBounds, guides, gauges) => dispatch => {
    dispatch({ type: CLEAR_ERRORS });
    // dispatch({
    //     type: LOADING_ENTRIES,
    // });
    dispatch({
        type: CLOSE_INFO,
    });

    let result = [];
    if (category === "riverflow") {
        result = gauges;
    } else if (category === "all") {
        result = gauges.concat(guides);
    } else {
        result = guides;
    }

    dispatch({
        type: GET_ENTRIES,
        payload: result,
    });
    dispatch({
        type: GENERATE_FILTERED_LIST,
        payload: {
            entries: result,
            filters,
            mapBounds,
        },
    });
}

export const setCategory = (category, filters, mapBounds, cancelToken, guideId) => dispatch => {
    dispatch({ type: CLEAR_ERRORS });
    dispatch({
        type: LOADING_ENTRIES,
    });
    dispatch({
        type: CLOSE_INFO,
    });

    dispatch(makeGuideRequest(category === "guides" || category === "all", filters, mapBounds, cancelToken, guideId));
    dispatch(makeGaugeRequest(category === "riverflow" || category === "all", filters, mapBounds, cancelToken, guideId));
};

export const openLogInfoPage = guide => dispatch => {
    dispatch({
        type: LOADING_LOG_ENTRIES,
    });
    dispatch({
        type: CLOSE_LOG_PAGE,
    });

    axios
    .get(`${rapidsApiUrl}graphql`,
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

export const openInfoPage = guide => dispatch => {
    dispatch({
        type: ADD_TO_RECENTS,
        payload: guide.id,
    });
    dispatch({ type: CLEAR_ERRORS });

    dispatch({
        type: OPEN_INFO,
        payload: {
            selectedGuide: guide,
            infoSelected: true,
        },
    });
    if (guide.activity === "riverflow") {

    } else {
        let guideId = guide.id;
        dispatch(getNotices(guideId));
        let query = "{guide(id:\"" + guideId + "\"){id, description,entry_details,exit_details,marker_list,key_facts_num,key_facts_char, latitude, longitude, attribution, entry_details}}"
        axios
        .get(`${rapidsApiUrl}graphql`,
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
                    attribution: item.attribution,
                    directions: item.entry_details,
                };
            dispatch({
                type: GET_ITEM_DETAILS,
                payload: result,
            });
            dispatch(openLogInfoPage(guide));
        })
        .catch(error => {
            dispatch({
                type: GET_ERRORS,
                payload: {message: "Request failed"}
            });
        });
    }

    if (guide.gauge_id) {
        const request = {
            action: "get_flows",
            id: [guide.gauge_id],
            crossDomain: true,
        }
        axios
            .post(riverServiceUrl, request)
            .then(res => {
                let data = res.data.flows;
                if (data) {
                    let result = data.map(item => (
                        {
                            time: item.time,
                            values: {
                                flow: item.flow,
                                stage_height: item.stage_height,
                                temperature: item.temperature,
                                rainfall: item.rainfall,
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

export const openDraftInfoPage = guide => dispatch => {
    dispatch({ type: CLEAR_ERRORS });

    dispatch({
        type: OPEN_INFO,
        payload: {
            selectedGuide: guide,
            infoSelected: true,
        },
    });

    let guideId = guide.id;
    let query = "{guidedraft(id:\"" + guideId + "\"){id, app_id, description,entry_details,exit_details,marker_list,key_facts_num,key_facts_char, latitude, longitude, attribution, entry_details, user_name, user_email, user_id, status, moderator_comments, createdAt}}"
    axios
    .get(`${rapidsApiUrl}graphql`,
        {
            headers: {'Authorization': ''},
            params: {query: query}
        }
    )
    .then(res => {
        let item = res.data.data.guidedraft;
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
                attribution: item.attribution,
                directions: item.entry_details,
                draftDetails: {
                    userName: item.user_name,
                    userEmail: item.user_email,
                    status: item.status,
                    moderatorComments: item.moderator_comments,
                    createdAt: item.createdAt,
                    appId: item.app_id,
                    userId: item.user_id,
                }
            };
        dispatch({
            type: GET_ITEM_DETAILS,
            payload: result,
        });
        dispatch(openLogInfoPage(guide));
    })
    .catch(error => {
        dispatch({
            type: GET_ERRORS,
            payload: {message: "Request failed"}
        });
    });

    if (guide.gauge_id) {
        const request = {
            action: "get_flows",
            id: [guide.gauge_id],
            crossDomain: true,
        }
        axios
            .post(riverServiceUrl, request)
            .then(res => {
                let data = res.data.flows;
                if (data) {
                    let result = data.map(item => (
                        {
                            time: item.time,
                            values: {
                                flow: item.flow,
                                stage_height: item.stage_height,
                                temperature: item.temperature,
                                rainfall: item.rainfall,
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


