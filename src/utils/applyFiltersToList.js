const hasIndex = (obj, str) => obj.toLowerCase().indexOf(str) > -1;

// apply filters - note: crazy ass, recursive, functional shit going on here
const checkFilter = ({ attribute, values }, guide) =>
    values.indexOf(guide[attribute]) > -1;

const applyFilters = ([head, ...tail]) => guide =>
    !head || (checkFilter(head, guide) && applyFilters(tail)(guide));

const checkIfInBounds = (mapBounds, guide) => {
    let upperLat = mapBounds._ne.lat;
    let upperLon = mapBounds._ne.lng;
    let lowerLat = mapBounds._sw.lat;
    let lowerLon = mapBounds._sw.lng;
    if (guide.lat < upperLat && guide.lat > lowerLat
        && guide.lng < upperLon && guide.lng > lowerLon) {
        return true;
    } else {
        return false;
    }
}

const applyMapBounds = (mapBounds) => guide =>
    !mapBounds._ne || checkIfInBounds(mapBounds, guide);

// apply filters + search
const applyFiltersToList = (guideList, filterValues, mapBounds) => {
    const { filters, searchString } = filterValues;
    return guideList.filter(applyFilters(filters)).filter(applyMapBounds(mapBounds)).filter(guide => {
        if (searchString === "") {
            return true;
        }
        return (
            hasIndex(guide.title, searchString) ||
            hasIndex(guide.region, searchString) ||
            hasIndex(guide.river, searchString)
        );
    });
};

export default applyFiltersToList;
