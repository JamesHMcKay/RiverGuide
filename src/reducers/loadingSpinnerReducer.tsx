import {
    CLEAR_LOADING_SPINNER,
    SET_LOADING_SPINNER,
} from "../actions/types";

const initialState: string = "";

export default function(state: string = initialState, action: any): string {
    switch (action.type) {
        case SET_LOADING_SPINNER:
            return action.payload;
        case CLEAR_LOADING_SPINNER:
            return "";
        default:
            return state;
    }
}
