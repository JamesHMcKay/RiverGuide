import React, { Component } from "react";
import { connect } from "react-redux";

// Types/Interfaces
import { IState } from "../../reducers/index";
import { IFilter, IListEntry, ILogEntry, IMapBounds } from "./../../utils/types";

// Actions
import { generateFilteredList } from "../../actions/actions";

// Components
import { createStyles, IconButton, Theme, Paper, InputBase } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

// Icons
import CloseIcon from "@material-ui/icons/Close";
import SearchIcon from "@material-ui/icons/Search";

const styles: any = (theme: Theme): any => createStyles({
    paper: {
        display: "flex",
        alignItems: "center",
        margin: theme.spacing(2, 0),
        [theme.breakpoints.up("md")]: {
            marginRight: theme.spacing(4)
        }
    }, 

    input: {
        marginLeft: theme.spacing(2),
        flex: 1
    }
});

interface ISearchBoxProps extends ISearchBoxStateToProps {
    classes: any;
    generateFilteredList: (
        guides: IListEntry[] | ILogEntry[],
        filter: IFilter,
        mapBounds: IMapBounds) => void;
    value: string;
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

    public clearSearch = (): void => {
        this.setState({
            value: "",
        });
        const filter: IFilter = {
            ...this.props.filters,
            searchString: "",
        };
        this.props.generateFilteredList(
            this.props.listEntries,
            filter,
            this.props.mapBounds,
        );
    }

    public render(): JSX.Element {
        const { classes, value, filters: { searchString } } = this.props;
        const containsSearch = searchString !== "";
        return (
            <Paper className={classes.paper} elevation={4}>
                <InputBase
                    value={searchString}
                    className={classes.input}
                    placeholder={`Search ${value}...`}
                    inputProps={{ "aria-label": `search ${value}` }}
                    onChange={this.handleSearch}
                />
                <IconButton
                    className={classes.iconButton}
                    onClick={this.clearSearch}
                    aria-label={containsSearch ? "Clear Search" : "Search"}
                >
                    {containsSearch ? <CloseIcon /> : <SearchIcon />}
                </IconButton>
            </Paper>
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
)(withStyles(styles)(SearchBox));
