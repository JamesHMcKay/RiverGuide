import { UPDATE_OPEN_LOG } from "../actions/types";

const initialState = {};

export default (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_OPEN_LOG:
            return action.payload;
        default:
            return state;
    }
};
