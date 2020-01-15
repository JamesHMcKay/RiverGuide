import { Tab, Tabs, Toolbar } from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
import { CancelTokenSource } from "axios";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link as RouterLink } from "react-router-dom";

import { IState } from "../reducers/index";
import SearchBox from "./common/SearchBox";
import { IAuth } from "../utils/types";

export interface ITabCategory {
    name: string;
    route: string;
    id: string;
    authOnly: boolean;
}

export const categories: ITabCategory[] = [
    {name: "All", route: "/all", id: "all", authOnly: false},
    {name: "River guides", route: "/guides", id: "guides", authOnly: false},
    {name: "Flow and rain", route: "/riverflow", id: "riverflow", authOnly: false},
    {name: "Trips", route: "/trips", id: "trips", authOnly: true},
];

export const tabIds: string[] = categories.map((item: ITabCategory) => item.id);

interface IControlBarProps extends IControlBarStateToProps {
    location: any;
    handleSelect: (event: any, id: string) => void;
}

interface IControlBarStateToProps {
    index: string;
    auth: IAuth;
}

interface IControlBarState {
    anchorEl: any;
    cancelToken: CancelTokenSource;
}

class ControlBar extends Component<IControlBarProps, IControlBarState> {
    public render(): JSX.Element {
        const categoriesFiltered: ITabCategory[] = this.props.auth.isAuthenticated ?
            categories : categories.filter(item => !item.authOnly);
        return (
            <Toolbar style = {{minHeight: "55px"}}>
                <SearchBox value ={categories[tabIds.indexOf(this.props.index)].name.toLowerCase()}/>
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
                        {categoriesFiltered.map((item: ITabCategory) => (
                            <Tab
                                component={RouterLink}
                                to={item.route}
                                label={item.name}
                                key={item.name}
                                onClick={(event: any): void => this.props.handleSelect(event, item.id)}
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

function mapStateToProps(state: IState): IControlBarStateToProps {
    return ({
        index: state.tabIndex,
        auth: state.auth,
    });
}

export default connect(
    mapStateToProps,
    { },
)(ControlBar);
