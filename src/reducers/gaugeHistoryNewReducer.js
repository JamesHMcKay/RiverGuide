import { GET_GAUGE_HISTORY_NEW, CLEAR_GAUGE_HISTORY_NEW } from "../actions/types";

const initialState = {};

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_GAUGE_HISTORY_NEW:
            return {gaugeHistory: action.payload};
        case CLEAR_GAUGE_HISTORY_NEW:
            return {gaugeHistory: []};
        default:
            return state;
    }
}
