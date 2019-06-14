import { ILogComplete } from "./types";

function hasIndex(obj: string, str: string): boolean {
    return obj.toLowerCase().indexOf(str) > -1;
}

function applySearchString(log: ILogComplete, searchString: string): boolean {
    let result: boolean = false;
    result = hasIndex(log.description, searchString) ||
                hasIndex(log.date, searchString) ||
                hasIndex(log.guide_name, searchString);

    return result;
}

function applyFiltersToLogList(logList: ILogComplete[], searchString: string): ILogComplete[] {
    let filteredList: ILogComplete[] = logList;
    if (searchString !== "") {
        filteredList = logList.filter((log: ILogComplete): boolean => {
            return applySearchString(log, searchString);
        });
    }
    return filteredList;
}

export default applyFiltersToLogList;
