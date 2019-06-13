import { GENERATE_FILTERED_LOG_LIST, GET_LOGS } from "../actions/types";
import applyFiltersToLogList from "../utils/applyFiltersToLogList";

const initialState = [];

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_LOGS:
            return action.payload;
        case GENERATE_FILTERED_LOG_LIST:
            return applyFiltersToLogList(
                action.payload.entries,
                action.payload.searchString,
            );
        default:
            return state;
    }
}
