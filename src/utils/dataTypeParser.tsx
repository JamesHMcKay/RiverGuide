import { IObsValue } from "./types";

export function dataTypeParser(type: keyof IObsValue): string {
    let result: string = "";
    switch (type) {
        case "flow":
            result = "Flow";
            break;
        case "stage_height":
            result = "Stage height";
            break;
        case "rainfall":
            result = "Rainfall";
            break;
        case "temperature":
            result = "Temperature";
    }
    return result;
}

export function unitParser(unit: string | undefined): string {
    let result: string = "";
    switch (unit) {
        case "cumecs":
            result = "m\u00B3/s";
            break;
        case "metres":
            result = "m";
            break;
        case "millimetres":
           result = "mm";
           break;
    }
    return result;
}
