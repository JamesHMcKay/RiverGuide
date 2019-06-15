import { CLOSE_INFO, OPEN_LOG_PAGE, CLOSE_LOG_PAGE } from "../actions/types";

const initialState = false;

export default function(state = initialState, action) {
    switch (action.type) {
        case OPEN_LOG_PAGE:
            return true;
        case CLOSE_INFO:
            return false;
        case CLOSE_LOG_PAGE:
            return false;
        default:
            return state;
    }
}
