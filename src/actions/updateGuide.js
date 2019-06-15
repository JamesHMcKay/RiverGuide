import axios from "axios";

import {
    CLOSE_MODAL
} from "./types";

const serverLocation = 'https://rapidsapi.herokuapp.com';

export const updateGuide = item => dispatch => {
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
