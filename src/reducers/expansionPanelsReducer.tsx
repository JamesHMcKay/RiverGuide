import {
    SET_EXPANSION_PANELS,
} from "../actions/types";
import { IExpansionPanels } from "../utils/types";

const initialState: IExpansionPanels = {
    description: true,
    keyFacts: true,
    map: true,
    logBook: true,
    latestData: true,
    flowHistory: true,
    flowDetails: true,
};

export default function(state: IExpansionPanels = initialState, action: any): IExpansionPanels {
    switch (action.type) {
        case SET_EXPANSION_PANELS:
            return action.payload;
        default:
            return state;
    }
}
