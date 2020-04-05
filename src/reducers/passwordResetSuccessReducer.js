import { RESET_PASSWORD_SUCCESS, RESET_PASSWORD_FAIL } from "../actions/types";

const initialState = false;

export default function(state = initialState, action) {
    switch (action.type) {
        case RESET_PASSWORD_SUCCESS:
            return true;
        case RESET_PASSWORD_FAIL:
            return false;
        default:
            return state;
    }
}
