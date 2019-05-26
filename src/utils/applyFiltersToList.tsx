import { IListEntry, IMapBounds, IGuide } from "./types";

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

function checkIfInBounds(mapBounds: IMapBounds, guide: IListEntry): boolean {
    const upperLat: number = mapBounds._ne.lat;
    const upperLon: number = mapBounds._ne.lng || 0;
    const lowerLat: number = mapBounds._sw.lat;
    const lowerLon: number = mapBounds._sw.lng || 0;
    if (!!guide.position.lat && !!guide.position.lon
        && guide.position.lat < upperLat && guide.position.lat > lowerLat
        && guide.position.lon < upperLon && guide.position.lon > lowerLon) {
        return true;
    } else {
        return false;
    }
}

function applyMapBounds(mapBounds: IMapBounds): (guide: IListEntry) => boolean {
    return ((guide: IListEntry): boolean =>
    !mapBounds._ne || checkIfInBounds(mapBounds, guide));
}

// apply filters + search
function applyFiltersToList(guideList: IListEntry[], filterValues: IFilterValues, mapBounds: IMapBounds): IListEntry[] {
    // const { filters: string[], searchString: string } = filterValues;
    let filteredList: IListEntry[] = guideList;
    if (filterValues.searchString === "") {
        filteredList = guideList.filter(applyMapBounds(mapBounds));
    } else {
        filteredList = guideList.filter((guide: IListEntry): boolean => {
            if (filterValues.searchString === "") {
                return true;
            }
            return (
                hasIndex(guide.display_name, filterValues.searchString) ||
                hasIndex(guide.region, filterValues.searchString)
                // hasIndex(guide.river_name, filterValues.searchString)
            );
        });
    }
    return filteredList;
}

export default applyFiltersToList;
