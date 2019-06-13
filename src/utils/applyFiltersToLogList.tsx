import { ILogEntry } from "./types";

function hasIndex(obj: string, str: string): boolean {
    return obj.toLowerCase().indexOf(str) > -1;
}

function applySearchString(log: ILogEntry, searchString: string): boolean {
    let result: boolean = false;
    result = hasIndex(log.description, searchString) ||
                hasIndex(log.date, searchString);

    return result;
}

function applyFiltersToLogList(logList: ILogEntry[], searchString: string): ILogEntry[] {
    let filteredList: ILogEntry[] = logList;
    if (searchString !== "") {
        filteredList = logList.filter((log: ILogEntry): boolean => {
            return applySearchString(log, searchString);
        });
    }
    return filteredList;
}

export default applyFiltersToLogList;
