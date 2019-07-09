import axios from "axios";

import {
    CLOSE_MODAL
} from "./types";
import { openInfoPage } from "./getGuides";

const serverLocation = 'https://rapidsapi.herokuapp.com';

export const updateGuide = (item, selectedGuide) => dispatch => {
    const request = {
        gauge_id: item.gaugeId,
        description: item.description,
        marker_list: Object.values(item.markers),
        key_facts_char: item.keyFactsChar,
        key_facts_num: item.keyFactsNum,
    };
    axios
        .put(serverLocation + '/guides/' + item.id, request)
        .then(res => {
            dispatch({
                type: CLOSE_MODAL
            });
            dispatch(openInfoPage(selectedGuide));
        });
};
