import {
    ADD_TO_RECENTS,
} from "../actions/types";

const initialState: string[] = [];

export default function(state: string[] = initialState, action: any): string[] {
    switch (action.type) {
        case ADD_TO_RECENTS:
            let recentItems: string[] = [...state];
            recentItems = recentItems.concat(action.payload);
            if (recentItems.length > 5) {
                recentItems = recentItems.slice(-5);
            }
            localStorage.setItem("recentItems", JSON.stringify(recentItems));
            return recentItems;
        default:
            return state;
    }
}
