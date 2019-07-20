// Material UI
import { Tab, Tabs, Toolbar } from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
import { CancelTokenSource } from "axios";
import axios from "axios";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import {
    closeInfoPage,
    setTabIndex,
} from "../actions/actions";
import { setCategory } from "../actions/getGuides";
import { IAuth, IFilter, IMapBounds } from "./../utils/types";

import { IState } from "../reducers/index";
import SearchBox from "./common/SearchBox";

export interface ITabCategory {
    name: string;
    route: string;
    id: string;
}

export const categories: ITabCategory[] = [
    {name: "Data", route: "/data", id: "data"},
    {name: "Activities", route: "/activities", id: "activities"},
    {name: "Trips", route: "/trips", id: "trips"},
];

export const tabIds: string[] = categories.map((item: ITabCategory) => item.id);

interface IControlBarProps extends IControlBarStateToProps {
    setCategory: (
        value: string,
        filter: IFilter,
        mapBounds: IMapBounds,
        token: CancelTokenSource) => void;
    location: any;
    closeInfoPage: () => void;
    setTabIndex: (index: string) => void;
}

interface IControlBarStateToProps {
    openModal: string;
    auth: IAuth;
    index: string;
    mapBounds: IMapBounds;
    filters: IFilter;
}

interface IControlBarState {
    anchorEl: any;
    cancelToken: CancelTokenSource;
}

class ControlBar extends Component<IControlBarProps, IControlBarState> {
    constructor(props: IControlBarProps) {
        super(props);

        const index: number = categories.map((item: ITabCategory) => item.route).indexOf(this.props.location.pathname);
        let defaultIndex: number = 1;
        if (index >= 0) {
            defaultIndex = index;
        }
        this.props.setTabIndex(categories[defaultIndex].id);
        const cancelToken: CancelTokenSource = axios.CancelToken.source();
        this.props.setCategory(categories[defaultIndex].id, this.props.filters, this.props.mapBounds, cancelToken);
        this.state = {
            anchorEl: null,
            cancelToken,
        };
    }

    // public componentDidMount(): void {
    //     if (this.props.index) {
    //         this.props.setCategory(this.props.index, this.state.cancelToken);
    //     }
    // }

    public handleSelect = (event: any, categoryId: string): void => {
        this.props.setTabIndex(categoryId);
        this.state.cancelToken.cancel();
        const newToken: CancelTokenSource = axios.CancelToken.source();
        this.setState({
            cancelToken: newToken,
        });
        if (categoryId === "trips") {
            this.props.setCategory("activities", this.props.filters, this.props.mapBounds, newToken);
            this.props.closeInfoPage();
        } else {
            this.props.setCategory(categoryId, this.props.filters, this.props.mapBounds, newToken);
        }

        this.handleClose();
    }

    public handleClick = (event: any): void => {
        this.setState({ anchorEl: event.currentTarget });
    }

    public handleClose = (): void => {
        this.setState({ anchorEl: null });
    }

    public render(): JSX.Element {
        return (
            <Toolbar>
                <SearchBox/>
                <Hidden smDown>
                <div
                    style={{
                        width: "73%",
                        // margin: "0 auto",
                        marginLeft: "5%",
                        color: "#fff",
                    }}
                >
                    <Tabs
                        value={tabIds.indexOf(this.props.index)}
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
                                onClick={(event: any): void => this.handleSelect(event, item.id)}
                                style={{color: "white"}}
                            />
                        ))}
                    </Tabs>
                </div>
                </Hidden>
            </Toolbar>
        );
    }
}

const mapStateToProps: (state: IState) => IControlBarStateToProps = (state: IState): IControlBarStateToProps => ({
    openModal: state.openModal,
    auth: state.auth,
    index: state.tabIndex,
    mapBounds: state.mapBounds,
    filters: state.filters,
});

export default connect(
    mapStateToProps,
    { setCategory, closeInfoPage, setTabIndex },
)(ControlBar);
