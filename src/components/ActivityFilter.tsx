import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import React, { Component } from "react";
import ReactGA from "react-ga";
import { connect } from "react-redux";
import { generateFilteredList } from "../actions/actions";
import { IState } from "../reducers/index";
import { IFilter, IListEntry, ILogEntry, IMapBounds } from "../utils/types";

export const ACTIVITY_MENU: Array<{name: string, id: string}> = [
    {name: "White water", id: "kayaking"},
    {name: "Fishing", id: "fishing"},
    {name: "Swimming", id: "swimming"},
    {name: "Select an activity", id: "all"},
];

interface IActivityFilterStateProps {
    mapBounds: IMapBounds;
    listEntries: IListEntry[];
    filters: IFilter;
}

interface IActivityFilterProps extends IActivityFilterStateProps {
    generateFilteredList: (
        guides: IListEntry[] | ILogEntry[],
        filter: IFilter,
        mapBounds: IMapBounds) => void;
}

class ActivityFilter extends Component<IActivityFilterProps> {

    public handleTypeChange = (event: any): void => {
        ReactGA.event({
            category: "Navigation",
            action: "ActivityFilter",
            label: event.target.value,
        });
        const filter: IFilter = {
            ...this.props.filters,
            activity: event.target.value,
        };
        this.props.generateFilteredList(
            this.props.listEntries,
            filter,
            this.props.mapBounds,
        );
    }

    public render(): JSX.Element {
        return (
            <Select
                disableUnderline
                value={this.props.filters.activity}
                style={{fontStyle: "italic"}}
                onChange={this.handleTypeChange}
                IconComponent={(): any => (null)}
                inputProps={{style: {fontStyle: "italic"}}}
            >
                {ACTIVITY_MENU.map((item: {name: string, id: string}) =>
                    <MenuItem value={item.id} key={item.id}>{item.name}</MenuItem>)
                }
            </Select>
        );
    }
}

function mapStateToProps(state: IState): IActivityFilterStateProps {
    return ({
        listEntries: state.listEntries,
        mapBounds: state.mapBounds,
        filters: state.filters,
    });
}

export default connect(
    mapStateToProps,
    { generateFilteredList },
)(ActivityFilter);
