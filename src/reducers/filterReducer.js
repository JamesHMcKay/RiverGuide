import { SEARCH_GUIDES, FILTER_GUIDES } from "../actions/types";

const initialState = {
    searchString: "",
    filters: []
};

const updateFilter = (filters, attribute, values) => {
    // remove filter if empty
    if (values.length < 1) {
        return filters.filter(f => f.attribute !== attribute);
    }

    // update filter if pre-existing
    const preFilterd =
        filters.filter(f => f.attribute === attribute).length > 0;
    if (preFilterd) {
        return filters.map(f => {
            if (f.attribute === attribute) {
                return {
                    attribute,
                    values
                };
            }
            return f;
        });
    }

    // add to filter
    filters.push({
        attribute,
        values
    });

    return filters;
};

export default (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case SEARCH_GUIDES:
            state.searchString = payload.toLowerCase();
            break;
        case FILTER_GUIDES:
            state.filters = updateFilter(
                state.filters,
                payload.attribute,
                payload.values
            );
            break;
        default:
            break;
    }

    return state;
};
