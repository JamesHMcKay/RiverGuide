import { IListEntry, ILogComplete, ILogEntry, IObsValue } from "./types";

export function getFlow(observables: IObsValue | undefined): string {
    if (!observables) {
      return "";
    } else {
      if (observables.flow) {
        return observables.flow.toFixed(1);
      }
    }
    return "";
}

export function getStageHeight(observables: IObsValue | undefined): string {
    if (!observables) {
      return "";
    } else {
      if (observables.stage_height) {
        return observables.stage_height.toFixed(1);
      }
    }
    return "";
}

function completeLogEntry(listEntries: IListEntry[] | undefined, logs: ILogEntry[]): ILogComplete[] {
    const result: ILogComplete[] = logs.map((item: ILogEntry) => ({
        ...item,
        guide_name: "",
        river_name: "",
        flow: getFlow(item.observables),
        stage_height: getStageHeight(item.observables),
    }));
    if (listEntries) {
        for (const log of result) {
            const listEntry: IListEntry[] = listEntries.filter((item: IListEntry) => item.id === log.guide_id);
            if (listEntry.length > 0) {
                log.guide_name = listEntry[0].display_name;
                log.river_name = listEntry[0].river_name || "";
            }
        }
    }
    return result;
}

export default completeLogEntry;
