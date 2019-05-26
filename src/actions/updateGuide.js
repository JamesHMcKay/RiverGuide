import axios from "axios";

import {
    CLOSE_MODAL
} from "./types";

const serverLocation = 'https://riverapi.herokuapp.com';

export const updateGuide = item => dispatch => {

console.log("ready to send update", item);

    const request = {
        gauge_id: item.gaugeId,
        description: item.description,
    };
    axios
        .put(serverLocation + '/wwguides/' + item.id, request)
        .then(res => {
            dispatch({
                type: CLOSE_MODAL
            });
        });
};
