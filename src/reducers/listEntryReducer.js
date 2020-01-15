import { GET_ENTRIES, LOADING_ENTRIES, APPEND_ENTRIES } from "../actions/types";

const initialState = [];
export default function(state = initialState, action) {
    switch (action.type) {
        case GET_ENTRIES:
            return action.payload;
        case APPEND_ENTRIES:
            return state.concat(action.payload);
        case LOADING_ENTRIES:
            return [];
        default:
            return state;
    }
}
