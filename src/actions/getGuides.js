import axios from "axios";

import {
    ADD_HISTORIC_FLOW,
    OPEN_INFO,
    CLOSE_INFO,
    GET_ENTRIES,
    LOADING_ENTRIES,
    GET_ITEM_DETAILS,
} from "./types";

const strapi_location = "https://riverapi.herokuapp.com/graphql";
const riverServiceLocation = process.env.REACT_APP_RIVER_SERVICE_URL;

// Set category
export const setCategory = (category, cancelToken) => dispatch => {
    dispatch({
        type: LOADING_ENTRIES,
    });
    dispatch({
        type: CLOSE_INFO,
    });

    if (category === "gauges") {
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
                        type: "gauge",
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
                params: {query: '{wwguides{id,river_name,section_name,region,latitude,longitude,gauge_id}}'},
                cancelToken: cancelToken.token
            }
        )
        .then(res => {
            let data = res.data.data.wwguides;
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
                type: GET_ENTRIES,
                payload: result,
            });
        })
        .catch(err => console.log(err));
    }
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
    console.log("opening info page");
    if (guide.type === "gauge") {

    } else {
        let guideId = guide.id;
        let query = "{wwguide(id:\"" + guideId + "\"){grade_overall,grade_hardest,description,entry_details,exit_details,marker_list}}"
        axios
        .get(`${strapi_location}`,
            {
                headers: {'Authorization': ''},
                params: {query: query}
            }
        )
        .then(res => {
            let item = res.data.data.wwguide;
            let result = 
                {
                    id: item.id,
                    entryDetails: item.entry_details,
                    exitDetails: item.exit_details,
                    gradeHardest: item.grade_hardest,
                    gradeOverall: item.grade_overall,
                    description: item.description,
                };
            console.log("got guide details: ", result);
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
                    type: ADD_HISTORIC_FLOW,
                    payload: result.reverse(),
                });
            });
    }
};


