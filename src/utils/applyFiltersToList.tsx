import { IGuide, IMapBounds } from "./types";

const hasIndex = (obj: string, str: string) => {
    return obj.toLowerCase().indexOf(str) > -1;
};

// const checkFilter = ({ attribute: string, values:  }, guide) =>
//     values.indexOf(guide[attribute]) > -1;

// const applyFilters = ([head, ...tail]): string[] => (guide: IGuide) =>
//     !head || (checkFilter(head, guide) && applyFilters(tail)(guide));

const checkIfInBounds = (mapBounds: IMapBounds, guide: IGuide) => {
    const upperLat = mapBounds._ne.lat;
    const upperLon = mapBounds._ne.lng || 0;
    const lowerLat = mapBounds._sw.lat;
    const lowerLon = mapBounds._sw.lng || 0;
    if (!!guide.lat && !!guide.lng
        && guide.lat < upperLat && guide.lat > lowerLat
        && guide.lng < upperLon && guide.lng > lowerLon) {
        return true;
    } else {
        return false;
    }
};

const applyMapBounds = (mapBounds: IMapBounds) => (guide: IGuide) =>
    !mapBounds._ne || checkIfInBounds(mapBounds, guide);

// apply filters + search
const applyFiltersToList = (guideList: IGuide[], filterValues: { filters: string[], searchString: string }, mapBounds: IMapBounds) => {
    // const { filters: string[], searchString: string } = filterValues;
    return guideList.filter(applyMapBounds(mapBounds)).filter((guide) => {
        if (filterValues.searchString === "") {
            return true;
        }
        return (
            hasIndex(guide.title, filterValues.searchString) ||
            hasIndex(guide.region, filterValues.searchString) ||
            hasIndex(guide.river, filterValues.searchString)
        );
    });
};

export default applyFiltersToList;
