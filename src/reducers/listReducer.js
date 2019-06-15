import { GET_ENTRIES, GENERATE_FILTERED_LIST, LOADING_ENTRIES } from "../actions/types";
import applyFiltersToList from "../utils/applyFiltersToList";

const initialState = [];

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_ENTRIES:
            return action.payload;
        case GENERATE_FILTERED_LIST:
            return applyFiltersToList(
                action.payload.entries,
                action.payload.searchString,
                action.payload.mapBounds,
            );
        case LOADING_ENTRIES:
            return [];
        default:
            return state;
    }
}
