import axios from "axios";

import {
    CLOSE_MODAL,
    GET_ENTRIES,
    CLOSE_INFO,
    GET_GUIDE_DRAFTS,
    GET_ERRORS,
    SET_LOADING_SPINNER,
    CLEAR_LOADING_SPINNER,
    CLEAR_ERRORS,
} from "./types";
import { openInfoPage } from "./getGuides";

const rapidsApiUrl = process.env.REACT_APP_RAPIDS_API_URL;

export const updateGuide = (item, selectedGuide, listEntries, user) => dispatch => {
    dispatch({
        type: SET_LOADING_SPINNER,
        payload: "submitDraftGuide",
    });
    const request = {
        gauge_id: item.gaugeId,
        description: item.description,
        marker_list: Object.values(item.markers),
        key_facts_char: item.keyFactsChar,
        key_facts_num: item.keyFactsNum,
        section_name: item.displayName,
        region: item.region,
        river_name: item.riverName,
        activity: item.activity,
        latitude: item.locationMarker.lat,
        longitude: item.locationMarker.lng,
        attribution: item.attribution,
        entry_details: item.directions,
        user_id: user.id,
        user_name: user.username
    };
    if (user.role === "riverguide_editor") {
        axios
        .put(rapidsApiUrl + 'guides/' + item.id, request)
        .then(res => {
            dispatch(openInfoPage(selectedGuide));
            dispatch({
                type: GET_ENTRIES,
                payload: listEntries.filter(entry => entry.id !== item.id).concat(selectedGuide),
            });
            dispatch({
                type: CLEAR_LOADING_SPINNER,
            });
        });
    } else {
        axios
        .post(rapidsApiUrl + 'guidedrafts', request)
        .then(res => {
            dispatch({
                type: CLEAR_LOADING_SPINNER,
            });
            dispatch({ type: CLEAR_ERRORS });
        }).catch(error => {
            dispatch({
                type: CLEAR_LOADING_SPINNER,
            });
            dispatch({
                type: GET_ERRORS,
                payload: {
                    message: "An error occured, please try submitting again",
                    id: "draftSubmissionError",
                }
            });
        });
    }
};

export const addGuide = (item, newGuide, listEntries, user) => dispatch => {
    dispatch({
        type: SET_LOADING_SPINNER,
        payload: "submitDraftGuide",
    });
    let address = rapidsApiUrl + 'guidedrafts';
    if (user.role === "riverguide_editor") {
        address = rapidsApiUrl + 'guides';
    }

    const request = {
        app_id: newGuide.id,
        gauge_id: item.gaugeId,
        description: item.description,
        marker_list: Object.values(item.markers),
        key_facts_char: item.keyFactsChar,
        key_facts_num: item.keyFactsNum,
        section_name: item.displayName,
        region: item.region,
        river_name: item.riverName,
        activity: item.activity,
        latitude: item.locationMarker.lat,
        longitude: item.locationMarker.lng,
        attribution: item.attribution,
        entry_details: item.directions,
        user_id: user.id,
        user_name: user.username
    };
    axios
        .post(address, request)
        .then(res => {
            dispatch({ type: CLEAR_ERRORS });
            newGuide.id = res.data.id;
            dispatch({
                type: GET_ENTRIES,
                payload: listEntries.concat(newGuide)
            });
            dispatch({
                type: CLEAR_LOADING_SPINNER,
            });
        }).catch(error => {
            dispatch({
                type: CLEAR_LOADING_SPINNER,
            });
            dispatch({
                type: GET_ERRORS,
                payload: {
                    message: "An error occured, please try submitting again",
                    id: "draftSubmissionError",
                }
            });
        });
};

export const deleteGuide = (selectGuideId, listEntries) => dispatch => {
    axios
        .delete(rapidsApiUrl + 'guides/' + selectGuideId)
        .then(res => {
            dispatch({
                type: CLOSE_MODAL
            });
            dispatch({
                type: CLOSE_INFO,
            });
            dispatch({
                type: GET_ENTRIES,
                payload: listEntries.filter(item => item.id !== selectGuideId),
            });
        });
};

export const deleteDraft = (selectGuideId, listEntries) => dispatch => {
    axios
        .delete(rapidsApiUrl + 'guidedrafts/' + selectGuideId)
        .then(res => {
            dispatch({
                type: CLOSE_MODAL
            });
            dispatch({
                type: CLOSE_INFO,
            });
            dispatch({
                type: GET_GUIDE_DRAFTS,
                payload: listEntries.filter(item => item.id !== selectGuideId),
            });
        });
};

export const getGuideDrafts = (userId) => dispatch => {
    axios
    .get(`${rapidsApiUrl}graphql`,
        {
            headers: {'Authorization': ''},
            params: {query: `{guidedrafts(where: {user_id: ["${userId}"]}){id,river_name,section_name,region,latitude,longitude,gauge_id, activity, status}}`},
        }
    )
    .then(res => {
        let data = res.data.data.guidedrafts;
        let result = data.map(item => (
            {
                id: item.id,
                display_name: item.section_name,
                river_name: item.river_name,
                position: {lat: item.latitude < 90 ? item.latitude : -45, lon: item.longitude },
                region: item.region,
                gauge_id: item.gauge_id,
                activity: item.activity,
                status: item.status
            }));
        dispatch({
            type: GET_GUIDE_DRAFTS,
            payload: result,
        });
    })
    .catch(error => {
        dispatch({
            type: GET_ERRORS,
            payload: {message: "Request failed"}
        });
    });
};