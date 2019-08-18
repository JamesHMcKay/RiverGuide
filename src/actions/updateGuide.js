import axios from "axios";

import {
    CLOSE_MODAL,
    GET_ENTRIES,
    CLOSE_INFO,
} from "./types";
import { openInfoPage } from "./getGuides";

const rapidsApiUrl = process.env.REACT_APP_RAPIDS_API_URL;

export const updateGuide = (item, selectedGuide, listEntries, userRole) => dispatch => {
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
    };
    if (userRole === "riverguide_editor") {
        axios
        .put(rapidsApiUrl + 'guides/' + item.id, request)
        .then(res => {
            dispatch({
                type: CLOSE_MODAL
            });
            dispatch(openInfoPage(selectedGuide));
            dispatch({
                type: GET_ENTRIES,
                payload: listEntries.filter(entry => entry.id !== item.id).concat(selectedGuide),
            });
        });
    } else {
        axios
        .post(rapidsApiUrl + 'guidedrafts', request)
        .then(res => {
        });
    }


};

export const addGuide = (item, newGuide, listEntries, userRole) => dispatch => {
    let address = rapidsApiUrl + 'guidedrafts';
    if (userRole === "riverguide_editor") {
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
    };
    axios
        .post(address, request)
        .then(res => {
            newGuide.id = res.data.id;
            dispatch({
                type: GET_ENTRIES,
                payload: listEntries.concat(newGuide)
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
            // dispatch(openInfoPage(selectedGuide));
        });
};