import { GET_GAUGES } from "../actions/types";

const initialState = [];

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_GAUGES:
            return action.payload;
        default:
            return state;
    }
}
