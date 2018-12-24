import { OPEN_INFO, CLOSE_INFO, ADD_HISTORIC_FLOW } from "../actions/types";

const initialState = {};

export default function(state = initialState, action) {
    switch (action.type) {
        case OPEN_INFO:
            return { ...action.payload, history: [] };
        case CLOSE_INFO:
            return {};
        case ADD_HISTORIC_FLOW:
            const newState = state;
            newState.history = action.payload;
            return newState;
        default:
            return state;
    }
}
