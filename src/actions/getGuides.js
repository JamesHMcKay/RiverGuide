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

// Get guides
export const makeEntriesRequest = category => dispatch => {
    if (category === "gauges") {
        const request = {
            action: "get_features",
            crossDomain: true,
        }
        axios
            .post(riverServiceLocation, request)
            .then(res => {
                let data = res.data.features;
                let result = data.map(item => (
                    {
                        id: item.id,
                        gauge_id: item.id,
                        display_name: item.name,
                        position: {lat: item.location.lat, lon: item.location.lon },
                        latest_flow: item.latest_flow,
                        region: item.data_source,
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
                params: {query: '{wwguides{app_id,river_name,section_name,region,latitude,longitude,gauge_id}}'}
            }
        )
        .then(res => {
            let data = res.data.data.wwguides;
            let result = data.map(item => (
                {
                    id: item.app_id,
                    display_name: item.section_name,
                    river_name: item.river_name,
                    position: {lat: item.latitude < 90 ? item.latitude : -45, lon: item.longitude },
                    region: item.region,
                }));
            dispatch({
                type: GET_ENTRIES,
                payload: result,
            });
        })
        .catch(err => console.log(err));
    }
};



// Set category
export const setCategory = category => dispatch => {
    dispatch({
        type: LOADING_ENTRIES,
    });
    dispatch({
        type: CLOSE_INFO,
    });

    if (category === "gauges") {
        const request = {
            action: "get_features",
            crossDomain: true,
        }
        axios
            .post(riverServiceLocation, request)
            .then(res => {
                let data = res.data.features;
                let result = data.map(item => (
                    {
                        id: item.id,
                        gauge_id: item.id,
                        display_name: item.name,
                        position: {lat: item.location.lat, lon: item.location.lon },
                        latest_flow: item.latest_flow,
                        region: item.data_source,
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
                params: {query: '{wwguides{app_id,river_name,section_name,region,latitude,longitude,gauge_id}}'}
            }
        )
        .then(res => {
            let data = res.data.data.wwguides;
            let result = data.map(item => (
                {
                    id: item.app_id,
                    display_name: item.section_name,
                    river_name: item.river_name,
                    position: {lat: item.latitude < 90 ? item.latitude : -45, lon: item.longitude },
                    region: item.region,
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
    let itemType = "";
    if (itemType === "gauges") {

    } else {
        axios
        .get(`${strapi_location}`,
            {
                headers: {'Authorization': ''},
                params: {query: '{wwguides{app_id,river_name,section_name,country,region,latitude,longitude,gauge_id,activity,grade_overall,grade_hardest,description,entry_details,exit_details,marker_list}}'}
            }
        )
        .then(res => {
            let data = res.data.data.wwguides;
            let result = data.map(item => (
                {
                    id: item.app_id,
                    display_name: item.section_name,
                    river_name: item.river_name,
                    position: {lat: item.latitude, lon: item.longitude },
                    region: item.region,
                    description: item.description,
                }));
            result = result[0];
            console.log(result);
            dispatch({
                type: GET_ITEM_DETAILS,
                payload: result,
            });
        })
        .catch(err => console.log(err));
    }


    if (guide.gauge_id) {
        console.log("GETTING GAUGE HISTORY");
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
                    }));
                console.log("GOT GAUGE HISTORY = ", result);
                dispatch({
                    type: ADD_HISTORIC_FLOW,
                    payload: result.reverse(),
                });
            });
    }
};


