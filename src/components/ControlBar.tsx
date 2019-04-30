import React, { Component, ReactChild, ReactElement } from "react";
import { connect } from "react-redux";
import {
    generateFilteredList,
    searchGuideList,
} from "../actions/actions";
import { setCategory } from "../actions/getGuides";
import { IFilter, IGuide, ILatLon, IMapBounds } from "./../utils/types";

// Material UI
import { AppBar, Tab, Tabs, TextField, Toolbar } from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { IState } from "../reducers/index";

// styles
import "react-dropdown/style.css";

const data: string[] = [
    "Fishing",
    "Jet boating",
    "Gauges",
    "Whitewater",
];

interface IControlBarProps extends IControlBarStateToProps {
    generateFilteredList: (
        guides: IGuide[],
        filters: IFilter[],
        mapBounds: IMapBounds) => void;
    searchGuideList: (value: string, guides: IGuide[]) => void;
    setCategory: (value: string) => void;
}

interface IControlBarStateToProps {
    openModal: string;
    mapBounds: IMapBounds;
    guides: IGuide[];
    filters: IFilter[];
}

interface IControlBarState {
    index: number;
    anchorEl: any;
}

const ITEM_HEIGHT: number = 48;

class ControlBar extends Component<IControlBarProps, IControlBarState> {
    public state: IControlBarState = {
        index: 3,
        anchorEl: null,
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

    public handleSelect = (event: any, category: string): void => {
        const index: number = data.indexOf(category);
        this.setState({ index });
        this.props.setCategory(category.toLowerCase());
        this.handleClose();
    }

    public handleClick = (event: any): void => {
        this.setState({ anchorEl: event.currentTarget });
    }

    public handleClose = (): void => {
        this.setState({ anchorEl: null });
    }

    public render(): JSX.Element {
        const { anchorEl } = this.state;
        const open: boolean = Boolean(anchorEl);

        return (
            <AppBar position="static" style={{ zIndex: 2 }}>
                <Toolbar>
                    <div
                        style={{
                            float: "left",
                            width: "27%",
                            textAlign: "center",
                            display: "flex",
                            flexDirection: "row",
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
                                minWidth: "300px",
                            }}
                        />
                    </div>
                    <Hidden mdUp>
                    <div style = {{right: "10%", position: "absolute"}}>
                            <IconButton
                            aria-label="More"
                            aria-owns={open ? "long-menu" : undefined}
                            aria-haspopup="true"
                            onClick={this.handleClick}
                            >
                            <MoreVertIcon />
                            </IconButton>
                            <Menu
                            id="long-menu"
                            anchorEl={anchorEl}
                            open={open}
                            onClose={this.handleClose}
                            PaperProps={{
                                style: {
                                maxHeight: ITEM_HEIGHT * 4.5,
                                width: 200,
                                },
                            }}
                            >
                            {data.map((category: string) => (
                                <MenuItem
                                    key={category}
                                    selected={data[this.state.index] === category}
                                    onClick={(event: any): void => this.handleSelect(event, category)}
                                >
                                    {category}
                                </MenuItem>
                            ))}
                            </Menu>
                            </div>
                    </Hidden>
                    <Hidden smDown>
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
                            {data.map((category: string) => (
                                <Tab label={category} key={category} />
                            ))}
                        </Tabs>
                    </div>
                    </Hidden>
                </Toolbar>
            </AppBar>
        );
    }
}

ControlBar.propTypes = {};

const mapStateToProps: (state: IState) => IControlBarStateToProps = (state: IState): IControlBarStateToProps => ({
    openModal: state.openModal,
    guides: state.guides,
    filters: state.filteredGuides,
    mapBounds: state.mapBounds,
});

export default connect(
    mapStateToProps,
    { generateFilteredList, searchGuideList, setCategory },
)(ControlBar);
