import { TextField } from "@material-ui/core";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
    generateFilteredList,
} from "../../actions/actions";
import { IState } from "../../reducers/index";
import { IFilter, IListEntry, ILogEntry, IMapBounds } from "./../../utils/types";

interface ISearchBoxProps extends ISearchBoxStateToProps {
    generateFilteredList: (
        guides: IListEntry[] | ILogEntry[],
        filter: IFilter,
        mapBounds: IMapBounds) => void;
}

interface ISearchBoxStateToProps {
    mapBounds: IMapBounds;
    listEntries: IListEntry[];
    filters: IFilter;
}

interface ISearchBoxState {
    value: string | null;
}

class SearchBox extends Component<ISearchBoxProps, ISearchBoxState> {
    constructor(props: ISearchBoxProps) {
        super(props);
        this.state = {
            value: null,
        };
    }

    public handleSearch = (event: any): void => {
        this.setState({
            value: event.target.value,
        });
        const filter: IFilter = {
            ...this.props.filters,
            searchString: event.target.value,
        };
        this.props.generateFilteredList(
            this.props.listEntries,
            filter,
            this.props.mapBounds,
        );
    }
    public render(): JSX.Element {
        return (
            <TextField
                id="standard-search"
                className="search-field"
                label="Search"
                type="search"
                margin="dense"
                variant="outlined"
                // inputProps={{ style: {height: "0.2em"} }}
                onChange={this.handleSearch}
                value={this.props.filters.searchString}
            />
        );
    }
}

const mapStateToProps: (state: IState) => ISearchBoxStateToProps = (state: IState): ISearchBoxStateToProps => ({
    listEntries: state.listEntries,
    mapBounds: state.mapBounds,
    filters: state.filters,
});

export default connect(
    mapStateToProps,
    { generateFilteredList },
)(SearchBox);
