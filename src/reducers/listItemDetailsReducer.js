import { GET_ITEM_DETAILS } from "../actions/types";

const initialState = {};

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_ITEM_DETAILS:
            const newState = state;
            newState.listItemDetails = action.payload;
            return newState;
        default:
            return state;
    }
}
