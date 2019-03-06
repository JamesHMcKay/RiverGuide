import { SET_CATEGORY } from "../actions/types";

export interface ICategory {
    title: string;
    values: string[];
}

const whitewater: ICategory[] = [
    {
        title: "activity",
        values: [
            "Kayaking",
            "Packrafting",
            "Rafting",
            "River Boarding",
            "River Bugging",
        ],
    },
    { title: "grade", values: ["1", "2", "3", "4", "5"] },
    {
        title: "character",
        values: ["Big Water", "Creeking", "Play", "River Run"],
    },
    {
        title: "rating",
        values: ["1", "2", "3", "4", "5"],
    },
];

const flatwater: ICategory[] = [
    {
        title: "activity",
        values: ["Canoing", "Rowing", "Multisport", "Sailing", "Waka Ama"],
    },
    {
        title: "rating",
        values: ["1", "2", "3", "4", "5"],
    },
];

const motorised: ICategory[] = [
    {
        title: "activity",
        values: ["Jetboating", "Jetskiing", "Motorbiking", "4-Wheel Driving"],
    },
    {
        title: "rating",
        values: ["1", "2", "3", "4", "5"],
    },
];

const fishing: ICategory[] = [
    {
        title: "catch",
        values: ["salmon", "brown trout", "rainbow trout"],
    },
    {
        title: "rating",
        values: ["1", "2", "3", "4", "5"],
    },
];

const other: ICategory[] = [
    {
        title: "activity",
        values: ["Biking", "Horse Riding", "Site Seeing", "Walking"],
    },
    {
        title: "rating",
        values: ["1", "2", "3", "4", "5"],
    },
];

export interface ICategoryState {
    name: string;
    filters: ICategory[];
}

const initialState: ICategoryState = { name: "fishing", filters: fishing };

export default function(state = initialState, action: any) {
    switch (action.type) {
        case SET_CATEGORY:
            if (action.payload === "whitewater") {
                return { name: action.payload, filters: whitewater };
            }
            if (action.payload === "flatwater") {
                return { name: action.payload, filters: flatwater };
            }
            if (action.payload === "motorised") {
                return { name: action.payload, filters: motorised };
            }
            if (action.payload === "fishing") {
                return { name: action.payload, filters: motorised };
            }
            if (action.payload === "other") {
                return { name: action.payload, filters: other };
            }
            return state;
        default:
            return state;
    }
}
