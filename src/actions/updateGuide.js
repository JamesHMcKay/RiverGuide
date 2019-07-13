import axios from "axios";

import {
    CLOSE_MODAL,
    GET_ENTRIES,
    CLOSE_INFO,
} from "./types";
import { openInfoPage } from "./getGuides";

const rapidsApiUrl = process.env.REACT_APP_RAPIDS_API_URL;

export const updateGuide = (item, selectedGuide, listEntries) => dispatch => {
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
    };
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
};

export const addGuide = (item, newGuide, listEntries) => dispatch => {
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
    };
    axios
        .post(rapidsApiUrl + 'guides', request)
        .then(res => {
            dispatch({
                type: CLOSE_MODAL
            });
            console.log(res);
            newGuide.id = res.data.id;
            dispatch({
                type: GET_ENTRIES,
                payload: listEntries.concat(newGuide)
            });
            // dispatch(openInfoPage(selectedGuide));
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