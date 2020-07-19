import LandscapeRounded from "@material-ui/icons/LandscapeRounded";
import LocalDining from "@material-ui/icons/LocalDining";
import QueryBuilder from "@material-ui/icons/QueryBuilder";
import Timeline from "@material-ui/icons/Timeline";
import WarningRounded from "@material-ui/icons/WarningRounded";
import Wc from "@material-ui/icons/Wc";
import React from "react";
import { IKeyFactProps, IKeyFactsNumItem } from "./types";

// How to add key facts
//
// The id for the key fact must be added to either IKeyFactsNum or IKeyFactsChar
// The type must be either IKeyFactsNumItem or string respectively
//
// Then add another line to either KEY_FACTS_NUM_PROPS or KEY_FACTS_CHAR_PROPS
// referencing the id, a name (which will be displayed to the user)
// and choose an icon.  Then finally import the icon in the header above.
//
// If you are adding a numeric key fact, make sure your desired units
// are in the unitOptions list, if not then add it in.

export const unitOptions: string[] = [
    "km",
    "m",
    "hours",
    "minutes",
    "days",
    "m/km",
];

export interface IKeyFactsNum {
    gradient: IKeyFactsNumItem;
    time: IKeyFactsNumItem;
    section_length: IKeyFactsNumItem;
}

export interface IKeyFactsChar {
    grade_overall: string;
    grade_hardest: string;
    toilet: string;
    catch_type: string;
}

export const KEY_FACTS_NUM_PROPS: Array<IKeyFactProps<IKeyFactsNum>> = [
    {key: "gradient", name: "Gradient", icon: <LandscapeRounded fontSize="large" />, activity: "kayaking"},
    {key: "time", name: "Time", icon: <QueryBuilder fontSize="large" />, activity: "kayaking"},
    {key: "section_length", name: "Length", icon: <Timeline fontSize="large" />, activity: "kayaking"},
];

export const KEY_FACTS_CHAR_PROPS: Array<IKeyFactProps<IKeyFactsChar>> = [
    {key: "grade_overall", name: "Grade", icon: <WarningRounded fontSize="large" />, activity: "kayaking"},
    {key: "grade_hardest", name: "Grade (hardest)", icon: <WarningRounded fontSize="large" />, activity: "kayaking"},
    {key: "toilet", name: "Toilet facilities", icon: <Wc fontSize="large" />, activity: "swimming"},
    {key: "catch_type", name: "Catch type", icon: <LocalDining fontSize="large" />, activity: "fishing"},
];
