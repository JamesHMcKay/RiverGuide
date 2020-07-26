import {
    CLEAR_NOTICES, GET_NOTICES,
} from "../actions/types";
import { INotice } from "../utils/types";

const initialState: INotice[] = [];

export default function(state: INotice[] = initialState, action: any): INotice[] {
    switch (action.type) {
        case GET_NOTICES:
            return action.payload;
        case CLEAR_NOTICES:
            return [];
        default:
            return state;
    }
}
