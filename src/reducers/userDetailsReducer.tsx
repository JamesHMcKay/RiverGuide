import {
    CLEAR_USER_DETAILS,
    SET_USER_DETAILS,
} from "../actions/types";
import { IUserDetails } from "../utils/types";

const initialState: IUserDetails = {
    id: "",
    user_favourites: [],
    user_id: "",
};

export default function(state: IUserDetails = initialState, action: any): IUserDetails {
    switch (action.type) {
        case SET_USER_DETAILS:
            return {
                ...state,
                ...action.payload,
            };
        case CLEAR_USER_DETAILS:
            return initialState;
        default:
            return state;
    }
}
