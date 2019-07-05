import {
    CLEAR_GAUGE_DISCLAIMER,
    GET_GAUGE_DISCLAIMER,
} from "../actions/types";

const initialState: string = "";

export default function(state: string = initialState, action: any): string {
    switch (action.type) {
        case GET_GAUGE_DISCLAIMER:
            return action.payload;
        case CLEAR_GAUGE_DISCLAIMER:
            return initialState;
        default:
            return state;
    }
}
