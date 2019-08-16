import { createStyles, IconButton, TextField, Theme } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
    generateFilteredList,
} from "../../actions/actions";
import { IState } from "../../reducers/index";
import { IFilter, IListEntry, ILogEntry, IMapBounds } from "./../../utils/types";

const styles: any = (theme: Theme): any => createStyles({
    container: {
      display: "flex",
      flexWrap: "wrap",
    },

    cssLabel: {
      color : "black",
    },

    cssOutlinedInput: {
      "&$cssFocused $notchedOutline": {
        borderColor: "black !important",
        borderWidth: "1px",
      },
    },

    cssFocused: {
        borderColor: "black !important",
    },

    notchedOutline: {
      borderWidth: "1px",
      borderColor: "black !important",
    },

});

interface ISearchBoxProps extends ISearchBoxStateToProps {
    classes: any;
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
        const { classes } = this.props;
        return (
            <div  className="search-field" style={{position: "relative", display: "inline-block"}}>
                <TextField
                    id="standard-search"
                    style={{width: "100%"}}
                    label="Search"
                    // type="search"
                    margin="dense"
                    variant="outlined"
                    onChange={this.handleSearch}
                    value={this.props.filters.searchString}
                    InputLabelProps={{
                        classes: {
                          root: classes.cssLabel,
                          focused: classes.cssFocused,
                        },
                      }}
                      InputProps={{
                        classes: {
                          root: classes.cssOutlinedInput,
                          focused: classes.cssFocused,
                          notchedOutline: classes.notchedOutline,
                        },
                        inputMode: "numeric",
                      }}
                />
                {this.props.filters.searchString !== "" &&
                <IconButton
                    onClick={this.clearSearch}
                    style={{position: "absolute", right: 0, top: "3px"}}
                    aria-label="Cancel"
                >
                    <CloseIcon fontSize="default" style={{color: "black"}} />
                </IconButton>
                }
            </div>
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
