import { SET_SEARCH_STRING_FILTER, SET_ACTIVITY_FILTER, SET_FILTER } from "../actions/types";

const initialState = {
    searchString: "",
    activity: "all",
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_SEARCH_STRING_FILTER:
            return {
                ...state,
                searchString: action.payload
            };
        case SET_ACTIVITY_FILTER:
            return {
                ...state,
                activity: action.payload
            };
        case SET_FILTER:
                return action.payload;
        default:
            return state;
    }
}
