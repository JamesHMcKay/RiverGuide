import { SET_FILTER } from "../actions/types";

const initialState = {
    searchString: "",
};

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_FILTER:
            let newState = state;
            newState = action.payload;
            return newState;
        default:
            return state;
    }
}
