import { OPEN_MODAL, CLOSE_MODAL } from "../actions/types";

// const initialState = {
//     openModal: false,
// };

//const initialState = "protectedModal";
const initialState = false;

export default (state = initialState, action) => {
    switch (action.type) {
        case OPEN_MODAL:
            return action.payload;
        case CLOSE_MODAL:
            return false;
        default:
            return state;
    }
};
