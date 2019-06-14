import { APPEND_LOGS, DELETE_LOG, EDIT_LOG, GET_LOGS, SET_LOG_GUIDE_NAMES } from "../actions/types";
import completeLogEntry from "../utils/completeLogEntry";

const initialState = [];

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_LOGS:
            let logs = completeLogEntry(state.listEntries, action.payload);
            return logs;
        case SET_LOG_GUIDE_NAMES:
            return completeLogEntry(action.payload.listEntries, action.payload.logs);
        case APPEND_LOGS:
            // upon creation log is not placed chronologically
            return [...state, action.payload];
        case EDIT_LOG:
            return state.map(
                log => (log._id === action.payload._id ? action.payload : log),
            );
        case DELETE_LOG:
            return state.filter(log => log._id !== action.payload);
        default:
            return state;
    }
};
