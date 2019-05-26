import { IGuide, IListEntry, IMapBounds } from "./types";

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
    result = hasIndex(guide.display_name, searchString) ||
                hasIndex(guide.region, searchString);
    if (guide.river_name) {
        result = result || hasIndex(guide.river_name, searchString);
    }

    return result;
}

function applyFiltersToList(guideList: IListEntry[], searchString: string, mapBounds: IMapBounds): IListEntry[] {
    // const { filters: string[], searchString: string } = filterValues;
    let filteredList: IListEntry[] = guideList;
    if (searchString === "") {
        filteredList = guideList.filter(applyMapBounds(mapBounds));
    } else {
        filteredList = guideList.filter((guide: IListEntry): boolean => {
            return applySearchString(guide, searchString);
        });
    }
    return filteredList;
}

export default applyFiltersToList;
