import {
    CLEAR_GUIDE_DRAFTS, GET_GUIDE_DRAFTS,
} from "../actions/types";
import { IListEntry } from "../utils/types";

const initialState: IListEntry[] = [];

export default function(state: IListEntry[] = initialState, action: any): IListEntry[] {
    switch (action.type) {
        case GET_GUIDE_DRAFTS:
            return action.payload;
        case CLEAR_GUIDE_DRAFTS:
            return [];
        default:
            return state;
    }
}
