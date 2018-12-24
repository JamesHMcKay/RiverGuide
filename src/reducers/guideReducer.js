import { GET_GUIDES, APPEND_GUIDES, LOADING_GUIDES } from "../actions/types";

const initialState = [];
export default function(state = initialState, action) {
    switch (action.type) {
        case GET_GUIDES:
            return action.payload;
        case APPEND_GUIDES:
            return [...state, action.payload];
        case LOADING_GUIDES:
            return [];
        default:
            return state;
    }
}
