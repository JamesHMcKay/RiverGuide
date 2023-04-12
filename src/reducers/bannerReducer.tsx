import {
    SET_BANNER_PAGE,
} from "../actions/types";

const initialState: boolean = true;

export default function(state: boolean = initialState, action: any): boolean {
    switch (action.type) {
        case SET_BANNER_PAGE:
            return action.payload;
        default:
            return state;
    }
}
