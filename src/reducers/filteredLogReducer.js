import { GENERATE_FILTERED_LOG_LIST, SET_LOG_GUIDE_NAMES, CLOSE_INFO, LOADING_LOG_ENTRIES} from "../actions/types";
import applyFiltersToLogList from "../utils/applyFiltersToLogList";
import completeLogEntry from "../utils/completeLogEntry";

const initialState = [];

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_LOG_GUIDE_NAMES:
            let namedLogs = completeLogEntry(action.payload.listEntries, action.payload.logs);
            return namedLogs;
        case LOADING_LOG_ENTRIES:
            return [];
        case GENERATE_FILTERED_LOG_LIST:
            return applyFiltersToLogList(
                action.payload.entries,
                action.payload.searchString,
            );
        case CLOSE_INFO:
            return [];
        default:
            return state;
    }
}
