import { RESET_PASSWORD_SENT, RESET_PASSWORD_SENT_RESET } from "../actions/types";

const initialState = false;

export default function(state = initialState, action) {
    switch (action.type) {
        case RESET_PASSWORD_SENT:
            return true;
        case RESET_PASSWORD_SENT_RESET:
            return false;
        default:
            return state;
    }
}
