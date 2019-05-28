import { GET_GAUGE_HISTORY, CLEAR_GAUGE_HISTORY } from "../actions/types";

const initialState = {};

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_GAUGE_HISTORY:
            return {gaugeHistory: action.payload};
        case CLEAR_GAUGE_HISTORY:
            return {gaugeHistory: []};
        default:
            return state;
    }
}
