// Material UI
import { AppBar } from "@material-ui/core";
import Hidden from "@material-ui/core/Hidden";
import React, { Component } from "react";
import { connect } from "react-redux";
import { IInfoPage } from "./../utils/types";

import { IState } from "../reducers/index";
import ControlBar from "./ControlBar";
import InfoControlBar from "./infoPanel/InfoControlBar";

interface ITabBarProps extends ITabBarStateToProps {
    location: any;
}

interface ITabBarStateToProps {
    infoPage: IInfoPage;
}

class TabBar extends Component<ITabBarProps> {
    public render(): JSX.Element {
        return (
            <AppBar position="static" style={{ zIndex: 2, minHeight: "60px", maxHeight: "8vh"}}>
                <Hidden smDown>
                    <ControlBar location={this.props.location}/>
                </Hidden>
                <Hidden mdUp>
                    {this.props.infoPage.infoSelected ?
                        <InfoControlBar/> :
                        <ControlBar location={this.props.location}/>
                    }
                </Hidden>
            </AppBar>
        );
    }
}

const mapStateToProps: (state: IState) => ITabBarStateToProps = (state: IState): ITabBarStateToProps => ({
    infoPage: state.infoPage,
});

export default connect(
    mapStateToProps,
    { },
)(TabBar);
