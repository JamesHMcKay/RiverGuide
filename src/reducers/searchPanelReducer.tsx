import {
    SET_SEARCH_PANEL,
} from "../actions/types";

const initialState: string = "list";

export default function(state: string = initialState, action: any): string {
    switch (action.type) {
        case SET_SEARCH_PANEL:
            return action.payload;
        default:
            return state;
    }
}
