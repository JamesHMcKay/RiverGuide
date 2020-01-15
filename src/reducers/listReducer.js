import { GENERATE_FILTERED_LIST, LOADING_ENTRIES, GENERATE_FILTERED_LIST_APPEND } from "../actions/types";
import applyFiltersToList from "../utils/applyFiltersToList";

const initialState = [];

export default function(state = initialState, action) {
    switch (action.type) {
        // case GET_ENTRIES:
        //     return action.payload;
        case GENERATE_FILTERED_LIST:
            return applyFiltersToList(
                action.payload.entries,
                action.payload.filters,
                action.payload.mapBounds,
            );
        case GENERATE_FILTERED_LIST_APPEND:
            return applyFiltersToList(
                state.concat(action.payload.entries),
                action.payload.filters,
                action.payload.mapBounds,
            );
        case LOADING_ENTRIES:
            return [];
        default:
            return state;
    }
}
