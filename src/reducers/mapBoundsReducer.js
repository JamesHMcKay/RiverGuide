import { SET_MAP_BOUNDS } from "../actions/types";

const initialState = {
    mapBounds: {}
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_MAP_BOUNDS:
            return action.payload;
        default:
            return state;
    }
};
