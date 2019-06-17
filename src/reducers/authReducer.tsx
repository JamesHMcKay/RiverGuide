import {
    ADD_TO_FAVOURITES,
    REMOVE_FROM_FAVOURITES,
    SET_CURRENT_USER,
} from "../actions/types";
import { IAuth, IUser } from "../utils/types";
import isEmpty from "../validation/is-empty";

const initialUser: IUser = {
    email: "",
    username: "",
    id: "",
    createdAt: "",
    provider: "",
};

const initialState: IAuth = {
    isAuthenticated: false,
    user: initialUser,
};

export default function(state: IAuth = initialState, action: any): IAuth {
    switch (action.type) {
        case SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: action.payload,
            };
        case ADD_TO_FAVOURITES:
            return {
                ...state,
                user: {
                    ...state.user,
                },
            };
        case REMOVE_FROM_FAVOURITES:
            return {
                ...state,
                user: {
                    ...state.user,
                },
            };
        default:
            return state;
    }
}
