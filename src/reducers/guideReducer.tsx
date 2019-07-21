import {
    GET_GUIDES,
} from "../actions/types";
import { IListEntry } from "../utils/types";

const initialState: IListEntry[] = [];

export default function(state: IListEntry[] = initialState, action: any): IListEntry[] {
    switch (action.type) {
        case GET_GUIDES:
            return action.payload;
        default:
            return state;
    }
}
