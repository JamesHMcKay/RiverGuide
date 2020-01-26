import React, { Component } from "react";
import { connect } from "react-redux";
import { Link as RouterLink } from "react-router-dom";

// Utils
import { CancelTokenSource } from "axios";

// Types/Interfaces
import { IState } from "../reducers/index";
import { IAuth } from "../utils/types";

// Components
import { Tab, Tabs, Toolbar, Hidden, Grid } from "@material-ui/core";
import SearchBox from "./common/SearchBox";

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
            categories : categories.filter((item: ITabCategory) => !item.authOnly);
        return (
            <Toolbar>
                <Grid container>
                    <Grid item xs={12} sm={12} md={4}>
                        <SearchBox value ={categories[tabIds.indexOf(this.props.index)].name.toLowerCase()}/>
                    </Grid>
                    <Grid item sm={8}>
                        <Hidden smDown>
                            <Tabs
                                value={tabIds.indexOf(this.props.index)}
                                variant="fullWidth"
                                style={{ marginTop: '2em' }}
                            >
                                {categoriesFiltered.map((item: ITabCategory) => (
                                    <Tab
                                        component={RouterLink}
                                        to={item.route}
                                        label={item.name}
                                        key={item.name}
                                        onClick={(event: any): void => this.props.handleSelect(event, item.id)}
                                    />
                                ))}
                            </Tabs>
                        </Hidden>
                    </Grid>
                </Grid>
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
    mapStateToProps, { },
)(ControlBar);
