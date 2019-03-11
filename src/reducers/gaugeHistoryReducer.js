import { GET_GAUGE_HISTORY } from "../actions/types";

const initialState = {};

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_GAUGE_HISTORY:
            const newState = state;
            newState.gaugeHistory = action.payload;
            return newState;
        default:
            return state;
    }
}
