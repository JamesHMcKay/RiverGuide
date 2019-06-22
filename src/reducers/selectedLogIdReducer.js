import { SET_SELECTED_LOG_ID } from "../actions/types";

const initialState = [];

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_SELECTED_LOG_ID:
            return action.payload;
        default:
            return state;
    }
}
