import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import React, { Component } from "react";
import { connect } from "react-redux";
import { generateFilteredList } from "../actions/actions";
import { IState } from "../reducers/index";
import { IFilter, IListEntry, ILogEntry, IMapBounds } from "../utils/types";

const ACTIVITY_MENU: Array<{name: string, id: string}> = [
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
                value={this.props.filters.activity}
                onChange={this.handleTypeChange}
            >
                {ACTIVITY_MENU.map((item: {name: string, id: string}) =>
                    <MenuItem value={item.id}>{item.name}</MenuItem>)
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
