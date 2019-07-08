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
    logPageOpen: boolean;
}

class TabBar extends Component<ITabBarProps> {
    public render(): JSX.Element {
        return (
            <AppBar position="static" style={{ zIndex: 2, minHeight: "65px", maxHeight: "8vh"}}>
                <Hidden smDown>
                    <ControlBar location={this.props.location}/>
                </Hidden>
                <Hidden mdUp>
                    {this.props.infoPage.infoSelected || this.props.logPageOpen ?
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
    logPageOpen: state.logPageOpen,
});

export default connect(
    mapStateToProps,
    { },
)(TabBar);
