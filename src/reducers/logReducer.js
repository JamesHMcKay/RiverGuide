import { APPEND_LOGS, DELETE_LOG, EDIT_LOG, GET_LOGS } from "../actions/types";

const initialState = [];

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_LOGS:
            return action.payload;
        case APPEND_LOGS:
            // upon creation log is not placed chronologically
            return [...state, action.payload];
        case EDIT_LOG:
            return state.map(
                log => (log._id === action.payload._id ? action.payload : log)
            );
        case DELETE_LOG:
            return state.filter(log => log._id !== action.payload);
        default:
            return state;
    }
};
