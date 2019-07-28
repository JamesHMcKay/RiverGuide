// Material UI
import { Tab, Tabs, Toolbar } from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
import { CancelTokenSource } from "axios";
import axios from "axios";
import React, { Component } from "react";
import ReactGA from "react-ga";
import { connect } from "react-redux";
import { Link as RouterLink } from "react-router-dom";
import {
    closeInfoPage,
    setTabIndex,
} from "../actions/actions";
import { openInfoPage, setCategory } from "../actions/getGuides";
import { IAuth, IFilter, IListEntry, IMapBounds } from "./../utils/types";

import { IState } from "../reducers/index";
import SearchBox from "./common/SearchBox";

export interface ITabCategory {
    name: string;
    route: string;
    id: string;
}

export const categories: ITabCategory[] = [
    {name: "Guides", route: "/guides", id: "guides"},
    {name: "River Flows", route: "/riverflow", id: "riverflow"},
    {name: "My Trips", route: "/trips", id: "trips"},
];

export const tabIds: string[] = categories.map((item: ITabCategory) => item.id);

interface IControlBarProps extends IControlBarStateToProps {
    setCategory: (
        value: string,
        filter: IFilter,
        mapBounds: IMapBounds | null,
        token: CancelTokenSource,
        guideId?: string) => void;
    location: any;
    closeInfoPage: () => void;
    setTabIndex: (index: string) => void;
    openInfoPage: (guide: IListEntry) => void;
}

interface IControlBarStateToProps {
    openModal: string;
    auth: IAuth;
    index: string;
    filters: IFilter;
}

interface IControlBarState {
    anchorEl: any;
    cancelToken: CancelTokenSource;
}

class ControlBar extends Component<IControlBarProps, IControlBarState> {
    constructor(props: IControlBarProps) {
        super(props);
        const path: string[] = this.props.location.pathname.split("/");
        const tabIndex: string = path.length > 1 ? path[1] : "";
        const index: number = categories.map((item: ITabCategory) => item.id).indexOf(tabIndex);
        let guideId: string | undefined;
        if (path.length > 4) {
            // this.props.openInfoPage({
            //     id: path[4],
            //     display_name: path[3],
            //     region: "",
            //     position: {lat: 0, lon: 0},
            //     activity: path[2]
            // });
            guideId = path[4];
        }

        let defaultIndex: number = 1;
        if (index >= 0) {
            defaultIndex = index;
        }
        this.props.setTabIndex(categories[defaultIndex].id);
        const cancelToken: CancelTokenSource = axios.CancelToken.source();
        this.props.setCategory(categories[defaultIndex].id, this.props.filters, null, cancelToken, guideId);
        this.state = {
            anchorEl: null,
            cancelToken,
        };
    }

    public handleSelect = (event: any, categoryId: string): void => {
        ReactGA.event({
            category: "Navigation",
            action: "Tab",
            label: categoryId,
        });
        this.props.setTabIndex(categoryId);
        this.state.cancelToken.cancel();
        const newToken: CancelTokenSource = axios.CancelToken.source();
        this.setState({
            cancelToken: newToken,
        });
        if (categoryId === "trips") {
            this.props.setCategory("activities", this.props.filters, null, newToken);
            this.props.closeInfoPage();
        } else {
            this.props.setCategory(categoryId, this.props.filters, null, newToken);
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
    filters: state.filters,
});

export default connect(
    mapStateToProps,
    { setCategory, closeInfoPage, setTabIndex, openInfoPage },
)(ControlBar);
