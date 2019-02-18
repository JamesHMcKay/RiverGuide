import { IGuide, IMapBounds } from "./types";

interface IFilterValues {
    filters: string[];
    searchString: string;
}

function hasIndex(obj: string, str: string): boolean {
    return obj.toLowerCase().indexOf(str) > -1;
}

// const checkFilter = ({ attribute: string, values:  }, guide) =>
//     values.indexOf(guide[attribute]) > -1;

// const applyFilters = ([head, ...tail]): string[] => (guide: IGuide) =>
//     !head || (checkFilter(head, guide) && applyFilters(tail)(guide));

function checkIfInBounds(mapBounds: IMapBounds, guide: IGuide): boolean {
    const upperLat: number = mapBounds._ne.lat;
    const upperLon: number = mapBounds._ne.lng || 0;
    const lowerLat: number = mapBounds._sw.lat;
    const lowerLon: number = mapBounds._sw.lng || 0;
    if (!!guide.lat && !!guide.lng
        && guide.lat < upperLat && guide.lat > lowerLat
        && guide.lng < upperLon && guide.lng > lowerLon) {
        return true;
    } else {
        return false;
    }
}

function applyMapBounds(mapBounds: IMapBounds): (guide: IGuide) => boolean {
    return ((guide: IGuide): boolean =>
    !mapBounds._ne || checkIfInBounds(mapBounds, guide));
}

// apply filters + search
function applyFiltersToList(guideList: IGuide[], filterValues: IFilterValues, mapBounds: IMapBounds): IGuide[] {
    // const { filters: string[], searchString: string } = filterValues;
    return guideList.filter(applyMapBounds(mapBounds)).filter((guide: IGuide): boolean => {
        if (filterValues.searchString === "") {
            return true;
        }
        return (
            hasIndex(guide.title, filterValues.searchString) ||
            hasIndex(guide.region, filterValues.searchString) ||
            hasIndex(guide.river, filterValues.searchString)
        );
    });
}

export default applyFiltersToList;
