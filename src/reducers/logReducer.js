import { APPEND_LOGS, DELETE_LOG, EDIT_LOG, GET_LOGS, CLEAR_LOGS } from "../actions/types";
import completeLogEntry, { getFlow } from "../utils/completeLogEntry";

const initialState = [];

export default (state = initialState, action) => {
    switch (action.type) {
        case GET_LOGS:
            return completeLogEntry(action.payload.listEntries, action.payload.logs)
        case APPEND_LOGS:
            return [...state, action.payload];
        case EDIT_LOG:
            let updatedLogs = state.filter(log => log.id !== action.payload.id);
            let updatedEntry = {
                ...action.payload,
                flow: getFlow(action.payload.observables)
            }
            return [updatedEntry, ...updatedLogs];
        case DELETE_LOG:
            return state.filter(log => log.id !== action.payload);
        case CLEAR_LOGS:
            return initialState;
        default:
            return state;
    }
};
