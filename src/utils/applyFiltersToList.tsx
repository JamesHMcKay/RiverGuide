import { IFilter, IListEntry, IMapBounds } from "./types";

function hasIndex(obj: string, str: string): boolean {
    return obj.toLowerCase().indexOf(str) > -1;
}

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

function applySearchString(guide: IListEntry, searchString: string): boolean {
    let result: boolean = false;
    result = hasIndex(guide.display_name.toLowerCase(), searchString) ||
                hasIndex(guide.region.toLowerCase(), searchString);
    if (guide.river_name) {
        result = result || hasIndex(guide.river_name.toLowerCase(), searchString);
    }

    return result;
}

function filterActivityType(guide: IListEntry, activity: string): boolean {
    if (guide.activity === "gauge") {
        return true;
    }
    return guide.activity === activity;
}

function applyFiltersToList(guideList: IListEntry[], filters: IFilter, mapBounds: IMapBounds): IListEntry[] {
    let filteredList: IListEntry[] = guideList;
    if (filters.activity !== "all") {
        guideList = guideList.filter((item: IListEntry) => filterActivityType(item, filters.activity));
    }
    if (filters.searchString === "") {
        filteredList = guideList.filter(applyMapBounds(mapBounds));
    } else {
        filteredList = guideList.filter((guide: IListEntry): boolean => {
            return applySearchString(guide, filters.searchString.toLowerCase());
        });
    }
    return filteredList;
}

export default applyFiltersToList;
