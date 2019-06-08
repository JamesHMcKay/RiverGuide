import { GET_WEATHER } from "../actions/types";
import { WeatherStore } from "../components/infoPanel/WeatherStore";

const initialState = new WeatherStore();

export default function(state = initialState, action) {
    switch (action.type) {
        case GET_WEATHER:
            const newState = state;
            newState.gaugeHistory = action.payload;
            return newState;
        default:
            return state;
    }
}
