import { Tab, Tabs, Toolbar } from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
import { CancelTokenSource } from "axios";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link as RouterLink } from "react-router-dom";

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
    location: any;
    handleSelect: (event: any, id: string) => void;
}

interface IControlBarStateToProps {
    index: string;
}

interface IControlBarState {
    anchorEl: any;
    cancelToken: CancelTokenSource;
}

class ControlBar extends Component<IControlBarProps, IControlBarState> {
    public render(): JSX.Element {
        return (
            <Toolbar style = {{minHeight: "55px"}}>
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
    });
}

export default connect(
    mapStateToProps,
    { },
)(ControlBar);
