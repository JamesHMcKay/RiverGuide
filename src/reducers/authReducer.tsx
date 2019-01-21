import isEmpty from "../validation/is-empty";

import {
    SET_CURRENT_USER,
    ADD_TO_FAVOURITES,
    REMOVE_FROM_FAVOURITES
} from "../actions/types";
import { IAuth, IUser } from "../utils/types";

const initialUser: IUser = {
    favourites: [],
    email: "",
}

const initialState: IAuth = {
    isAuthenticated: false,
    user: initialUser,
};

export default function(state = initialState, action: any) {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload
            };
        case ADD_TO_FAVOURITES:
            return {
                ...state,
                user: {
                    ...state.user,
                    favourites: [...state.user.favourites, action.payload]
                }
            }
        case REMOVE_FROM_FAVOURITES:
            return {
                ...state,
                user: {
                    ...state.user,
                    favourites: state.user.favourites.filter((fav: any) => fav !== action.payload)
                }
            }
        default:
            return state;
    }
}
