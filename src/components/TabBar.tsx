// Material UI
import { AppBar } from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
import { CancelTokenSource } from "axios";
import axios from "axios";
import React, { Component } from "react";
import { connect } from "react-redux";
import {
    closeInfoPage,
    openLogPage,
    setTabIndex,
} from "../actions/actions";
import { openInfoPage, setCategory, updateCategory } from "../actions/getGuides";
import { IFilter, IGauge, IInfoPage, IListEntry, IMapBounds } from "./../utils/types";

import { IState } from "../reducers/index";
import ControlBar from "./ControlBar";
import { categories, ITabCategory } from "./ControlBar";
import InfoControlBar from "./infoPanel/InfoControlBar";

interface ITabBarProps extends ITabBarStateToProps {
    setCategory: (
        value: string,
        filter: IFilter,
        mapBounds: IMapBounds | null,
        token: CancelTokenSource,
        guideId?: string) => void;
    updateCategory: (
        value: string,
        filter: IFilter,
        mapBounds: IMapBounds | null,
        guides: IListEntry[],
        gauges: IGauge[]) => void;
    location: any;
    closeInfoPage: () => void;
    openLogPage: () => void;
    setTabIndex: (index: string) => void;
    openInfoPage: (guide: IListEntry) => void;
}

interface ITabBarState {
    anchorEl: any;
    cancelToken: CancelTokenSource;
}

interface ITabBarStateToProps {
    infoPage: IInfoPage;
    logPageOpen: boolean;
    filters: IFilter;
    guides: IListEntry[];
    gauges: IGauge[];
}

class TabBar extends Component<ITabBarProps, ITabBarState> {
    constructor(props: ITabBarProps) {
        super(props);
        const path: string[] = this.props.location.pathname.split("/");
        const tabIndex: string = path.length > 1 ? path[1] : "";
        const index: number = categories.map((item: ITabCategory) => item.id).indexOf(tabIndex);
        let guideId: string | undefined;
        if (path.length > 4) {
            guideId = path[4];
        }

        let defaultIndex: number = 0;
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
        this.props.setTabIndex(categoryId);
        this.state.cancelToken.cancel();
        const newToken: CancelTokenSource = axios.CancelToken.source();
        this.setState({
            cancelToken: newToken,
        });
        if (categoryId === "trips") {
            // this.props.setCategory("activities", this.props.filters, null, newToken);
            this.props.updateCategory("guides", this.props.filters, null, this.props.guides, this.props.gauges);
            this.props.closeInfoPage();
            this.props.openLogPage();
        } else {
            // this.props.setCategory(categoryId, this.props.filters, null, newToken);
            this.props.updateCategory(categoryId, this.props.filters, null, this.props.guides, this.props.gauges);
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
            <AppBar position="static">
                <Hidden smDown>
                    <ControlBar location={this.props.location} handleSelect={this.handleSelect}/>
                </Hidden>
                <Hidden mdUp>
                    {this.props.infoPage.infoSelected || this.props.logPageOpen ?
                        <InfoControlBar/> :
                        <ControlBar location={this.props.location} handleSelect={this.handleSelect}/>
                    }
                </Hidden>
            </AppBar>
        );
    }
}

const mapStateToProps: (state: IState) => ITabBarStateToProps = (state: IState): ITabBarStateToProps => ({
    infoPage: state.infoPage,
    logPageOpen: state.logPageOpen,
    filters: state.filters,
    guides: state.guides,
    gauges: state.gauges,
});

export default connect(
    mapStateToProps,
    { setCategory, closeInfoPage, setTabIndex, openInfoPage, updateCategory, openLogPage },
)(TabBar);
