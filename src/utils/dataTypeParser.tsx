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
        case "celcius":
            result = "\u00B0C";
            break;
    }
    return result;
}

export function dataTypeToUnit(type: string | undefined): string {
    let result: string = "";
    switch (type) {
        case "flow":
            result = "m\u00B3/s";
            break;
        case "stage_height":
            result = "m";
            break;
        case "rainfall":
           result = "mm";
           break;
        case "temperature":
            result = "\u00B0C";
            break;
    }
    return result;
}
