import { SET_TAB_INDEX } from "../actions/types";

const initialState = "guides";

export default function(state = initialState, action) {
    switch (action.type) {
        case SET_TAB_INDEX:
            return action.payload;
        default:
            return state;
    }
}
