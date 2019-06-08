import { OPEN_INFO, CLOSE_INFO, ADD_HISTORIC_FLOW, GET_ITEM_DETAILS } from "../actions/types";

const initialState = {};

export default function(state = initialState, action) {
    switch (action.type) {
        case OPEN_INFO:
            return { ...action.payload, history: [] };
        case CLOSE_INFO:
            return {};
        case ADD_HISTORIC_FLOW:
            return {...state, history: action.payload};
        case GET_ITEM_DETAILS:
            return {...state, itemDetails: action.payload};
        default:
            return state;
    }
}
