import { GET_GUIDES, GENERATE_FILTERED_LIST } from "../actions/types";
import applyFiltersToList from "../utils/applyFiltersToList";

const initialState = [];

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_GUIDES:
            return action.payload;
        case GENERATE_FILTERED_LIST:
            return applyFiltersToList(
                action.payload.guides,
                action.payload.filters,
                action.payload.mapBounds,
            );
        default:
            return state;
    }
}
