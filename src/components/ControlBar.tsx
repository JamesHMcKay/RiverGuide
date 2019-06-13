// Material UI
import { AppBar, Tab, Tabs, TextField, Toolbar } from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { CancelTokenSource } from "axios";
import axios from "axios";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import {
    generateFilteredList,
    searchGuideList,
} from "../actions/actions";
import { setCategory } from "../actions/getGuides";
import { IAuth, IFilter, IGuide, IListEntry, ILogEntry, IMapBounds } from "./../utils/types";

import { IState } from "../reducers/index";

interface ITabCategory {
    name: string;
    route: string;
}

const categories: ITabCategory[] = [
    {name: "Fishing", route: "/fishing"},
    {name: "Jet boating", route: "'jetboating"},
    {name: "Gauges", route: "/gauges"},
    {name: "Whitewater", route: "/whitewater"},
    {name: "Log book", route: "/profile"},
];

const tabNames: string[] = categories.map((item: ITabCategory) => item.name);

interface IControlBarProps extends IControlBarStateToProps {
    generateFilteredList: (
        guides: IListEntry[] | ILogEntry[],
        searchString: string,
        mapBounds: IMapBounds,
        isLogList: boolean) => void;
    searchGuideList: (value: string, guides: IGuide[]) => void;
    setCategory: (value: string, token: CancelTokenSource) => void;
    location: any;
}

interface IControlBarStateToProps {
    openModal: string;
    mapBounds: IMapBounds;
    listEntries: IListEntry[];
    filters: IFilter;
    auth: IAuth;
    logs: ILogEntry[];
}

interface IControlBarState {
    index: number;
    anchorEl: any;
    cancelToken: CancelTokenSource;
}

const ITEM_HEIGHT: number = 48;

class ControlBar extends Component<IControlBarProps, IControlBarState> {

    public state: IControlBarState = {
        index: 3,
        anchorEl: null,
        cancelToken: axios.CancelToken.source(),
    };
    constructor(props: IControlBarProps) {
        super(props);

        const index: number = categories.map((item: ITabCategory) => item.route).indexOf(this.props.location.pathname);
        let defaultIndex: number = 3;
        if (index >= 0) {
            defaultIndex = index;
        }

        this.state = {
            index: defaultIndex,
            anchorEl: null,
            cancelToken: axios.CancelToken.source(),
        };
    }

    public componentDidMount(): void {
        this.props.setCategory(tabNames[this.state.index].toLowerCase(), this.state.cancelToken);
    }

    public handleChange = (event: any, value: number): void => {
        this.setState({ index: value });
        this.state.cancelToken.cancel();
        const newToken: CancelTokenSource = axios.CancelToken.source();
        this.setState({
            cancelToken: newToken,
        });
        this.props.setCategory(tabNames[value].toLowerCase(), newToken);
    }

    public handleSearch = (event: any): void => {
        // this.props.searchGuideList(event.target.value, this.props.guides);
        const isLogList: boolean = tabNames[this.state.index] === "Log book";
        const entries: IListEntry[] | ILogEntry[] = isLogList ? this.props.logs : this.props.listEntries;
        this.props.generateFilteredList(
            entries,
            event.target.value,
            this.props.mapBounds,
            isLogList,
        );
    }

    public handleSelect = (event: any, category: string): void => {
        const index: number = categories.map((item: ITabCategory) => item.name).indexOf(category);
        this.setState({ index });
        this.state.cancelToken.cancel();
        const newToken: CancelTokenSource = axios.CancelToken.source();
        this.setState({
            cancelToken: newToken,
        });
        if (category === "logbook") {
            this.props.setCategory("whitewater", newToken);
        } else {
            this.props.setCategory(category.toLowerCase(), newToken);
        }

        this.handleClose();
    }

    public handleClick = (event: any): void => {
        this.setState({ anchorEl: event.currentTarget });
    }

    public handleClose = (): void => {
        this.setState({ anchorEl: null });
    }

    public getGuideSearchBox = (): JSX.Element => {
        return (
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
                id="standard-search"
                className="search-field"
                color="white"
                label="Search"
                type="search"
                margin="normal"
                variant="outlined"
                onChange={this.handleSearch}
                style={{
                    width: "100%",
                    paddingBottom: ".5em",
                    color: "white",
                    minWidth: "300px",
                }}
                value={this.props.filters.searchString}
            />
        </div>
        );
    }

    public render(): JSX.Element {
        const { anchorEl } = this.state;
        const open: boolean = Boolean(anchorEl);

        return (
            <AppBar position="static" style={{ zIndex: 2 }}>
                <Toolbar>
                    {this.getGuideSearchBox()}
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
                            {categories.map((item: ITabCategory) => (
                                    <MenuItem
                                        component={RouterLink}
                                        to={item.route}
                                        key={item.name}
                                        selected={tabNames[this.state.index] === item.name}
                                        onClick={(event: any): void => this.handleSelect(event, item.name)}
                                    >
                                        {item.name}
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
                            style={{
                                color: "#fff",
                            }}
                        >
                            {categories.map((item: ITabCategory) => (
                                <Tab
                                    component={RouterLink}
                                    to={item.route}
                                    label={item.name}
                                    key={item.name}
                                    onClick={(event: any): void => this.handleSelect(event, item.name)}
                                    style={{color: "white"}}
                                />
                            ))}
                        </Tabs>
                    </div>
                    </Hidden>
                </Toolbar>
            </AppBar>
        );
    }
}

const mapStateToProps: (state: IState) => IControlBarStateToProps = (state: IState): IControlBarStateToProps => ({
    openModal: state.openModal,
    listEntries: state.listEntries,
    logs: state.log,
    mapBounds: state.mapBounds,
    filters: state.filters,
    auth: state.auth,
});

export default connect(
    mapStateToProps,
    { generateFilteredList, searchGuideList, setCategory },
)(ControlBar);
