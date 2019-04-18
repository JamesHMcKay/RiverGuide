import { GET_SENSOR_DATA } from "../actions/types";

const initialState = {};

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_SENSOR_DATA:
            const newState = state;
            newState.sensorFeatureList = action.payload;
            return newState;
        default:
            return state;
    }
}
