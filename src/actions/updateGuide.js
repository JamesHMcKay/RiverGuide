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
import { openDraftInfoPage, openInfoPage } from "./getGuides";

const rapidsApiUrl = process.env.REACT_APP_RAPIDS_API_URL;

export const acceptDraft = (draftGuide, listEntries, existingGuide, selectedGuide, user) => dispatch => {
    dispatch({
        type: SET_LOADING_SPINNER,
        payload: "acceptDraftGuide",
    });
    const request = {
        attribution: draftGuide.attribution,
        entry_details: draftGuide.directions,
        description: draftGuide.description,
        marker_list: draftGuide.markerList,
        key_facts_char: draftGuide.key_facts_char,
        key_facts_num: draftGuide.key_facts_num,
        activity: selectedGuide.activity,
        section_name: selectedGuide.display_name,
        gauge_id: selectedGuide.gauge_id,
        region: selectedGuide.region,
        river_name: selectedGuide.river_name,
        latitude: selectedGuide.position.lat,
        longitude: selectedGuide.position.lon,
    };
    if (existingGuide) {
        axios
        .put(rapidsApiUrl + 'guides/' + draftGuide.draftDetails.appId, request)
        .then(res => {
            dispatch({
                type: GET_ENTRIES,
                payload: listEntries.filter(entry => entry.id !== draftGuide.id).concat(selectedGuide),
            });
            dispatch({
                type: CLEAR_LOADING_SPINNER,
            });
            dispatch(updateDraftStatus(selectedGuide.id, "accepted", user.id, selectedGuide));
            dispatch({
                type: CLOSE_MODAL,
            });
        });
    } else {
        axios
        .post(rapidsApiUrl + 'guides', request)
        .then(res => {
            dispatch({
                type: GET_ENTRIES,
                payload: listEntries.filter(entry => entry.id !== draftGuide.id).concat(selectedGuide),
            });
            dispatch({
                type: CLEAR_LOADING_SPINNER,
            });
            dispatch(updateDraftStatus(selectedGuide.id, "accepted", user.id, selectedGuide));
            dispatch({
                type: CLOSE_MODAL,
            });
        });
    }
}


export const updateDraftStatus = (id, status, user, selectedGuide, comments) => dispatch => {
    dispatch({
        type: SET_LOADING_SPINNER,
        payload: "updateDraftStatus",
    });
    const request = {
        status: status,
        moderator_comments: comments,
    };
    axios
    .put(rapidsApiUrl + 'guidedrafts/' + id, request)
    .then(res => {
        dispatch({
            type: CLEAR_LOADING_SPINNER,
        });
        dispatch(getGuideDrafts(user));
        dispatch(openDraftInfoPage(selectedGuide));
        dispatch({ type: CLEAR_ERRORS });
        dispatch({
            type: CLOSE_MODAL,
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

export const updateGuide = (item, selectedGuide, listEntries, user, userEmail, appId, updateDraft) => dispatch => {
    dispatch({
        type: SET_LOADING_SPINNER,
        payload: "submitDraftGuide",
    });
    const request = {
        app_id: appId,
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
        user_id: item.userId,
        user_name: item.userName,
        user_email: item.userEmail,
        status: "pending_review",
        moderator_comments: item.moderatorComments
    };
    if (updateDraft) {
        axios
        .put(rapidsApiUrl + 'guidedrafts/' + item.id, request)
        .then(res => {
            dispatch({
                type: CLEAR_LOADING_SPINNER,
            });
            dispatch(getGuideDrafts(user));
            dispatch(openDraftInfoPage(selectedGuide));
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
    } else {
        axios
        .post(rapidsApiUrl + 'guidedrafts', request)
        .then(res => {
            dispatch({
                type: CLEAR_LOADING_SPINNER,
            });
            dispatch(getGuideDrafts(user));
            dispatch(openInfoPage(selectedGuide));
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

export const addGuide = (item, newGuide, listEntries, user, userEmail) => dispatch => {
    dispatch({
        type: SET_LOADING_SPINNER,
        payload: "submitDraftGuide",
    });
    let address = rapidsApiUrl + 'guidedrafts';
    if (user.role === "riverguide_editor") {
        address = rapidsApiUrl + 'guides';
    }

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
        user_name: user.username,
        user_email: userEmail,
        status: "pending_review",
        moderator_comments: item.moderatorComments,
    };
    axios
        .post(address, request)
        .then(res => {
            dispatch({ type: CLEAR_ERRORS });
            dispatch(getGuideDrafts(user));
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

export const getGuideDrafts = (user) => dispatch => {

    let query_text = "";
    if (user.role === "editor") {
        query_text = `{guidedrafts(limit:999){id,river_name,section_name,region,latitude,longitude,gauge_id, activity, status}}`;
    } else {
        query_text = `{guidedrafts(where: {user_id: ["${user.id}"]}){id,river_name,section_name,region,latitude,longitude,gauge_id, activity, status}}`;
    }

    axios
    .get(`${rapidsApiUrl}graphql`,
        {
            headers: {'Authorization': ''},
            params: {query: query_text},
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