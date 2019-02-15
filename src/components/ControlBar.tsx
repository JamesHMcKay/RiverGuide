import React, { Component, ReactChild, ReactElement } from "react";
import { connect } from "react-redux";
import {
    generateFilteredList,
    searchGuideList,
    setCategory,
} from "../actions/actions";
import { IFilter, IGuide, ILatLon, IMapBounds } from "./../utils/types";

// Material UI
import { AppBar, Tab, Tabs, TextField, Toolbar } from "@material-ui/core";

import { State } from "../reducers/index";

// styles
import "react-dropdown/style.css";

const data: string[] = [
    "Fishing",
    "Flatwater",
    "Motorised",
    "Whitewater",
    "Other",
];

interface IControlBarProps {
    openModal: string;
    mapBounds: IMapBounds;
    generateFilteredList: (
        guides: IGuide[],
        filters: IFilter[],
        mapBounds: IMapBounds) => void;
    searchGuideList: (value: string, guides: IGuide[]) => void;
    setCategory: (value: string) => void;
    guides: IGuide[];
    filters: IFilter[];
}

interface IControlBarState {
    index: number;
}

class ControlBar extends Component<IControlBarProps, IControlBarState> {
    public state: IControlBarState = {
        index: 3,
    };

    public handleChange = (event: any, value: number): void => {
        this.setState({ index: value });
        this.props.setCategory(data[value].toLowerCase());
    }

    public handleSearch = (event: any): void => {
        this.props.searchGuideList(event.target.value, this.props.guides);
        setTimeout(
            () =>
                this.props.generateFilteredList(
                    this.props.guides,
                    this.props.filters,
                    this.props.mapBounds,
                ),
            100,
        );
    }

    public render(): JSX.Element {
        return (
            <AppBar position="static" style={{ zIndex: 2 }}>
                <Toolbar>
                    <div
                        style={{
                            float: "left",
                            width: "27%",
                            textAlign: "center",
                        }}
                    >
                        <TextField
                            className="search-field"
                            label="Search Guides"
                            type="search"
                            margin="normal"
                            variant="outlined"
                            onChange={this.handleSearch}
                            style={{
                                width: "100%",
                                paddingBottom: ".5em",
                                color: "#fff",
                            }}
                        />
                    </div>
                    <div
                        style={{
                            width: "73%",
                            margin: "0 auto",
                            color: "#fff",
                        }}
                    >
                        <Tabs
                            value={this.state.index}
                            onChange={this.handleChange}
                            scrollable
                            scrollButtons="on"
                            style={{
                                color: "#fff",
                            }}
                        >
                            {data.map((category) => (
                                <Tab label={category} key={category} />
                            ))}
                        </Tabs>
                    </div>
                </Toolbar>
            </AppBar>
        );
    }
}

ControlBar.propTypes = {};

const mapStateToProps = (state: State) => ({
    openModal: state.openModal,
    guides: state.guides,
    filters: state.filteredGuides,
    mapBounds: state.mapBounds,
});

export default connect(
    mapStateToProps,
    { generateFilteredList, searchGuideList, setCategory },
)(ControlBar);
