import React, { Component } from "react";
import { connect } from "react-redux";

import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import InsertChartOutlinedRoundedIcon from "@material-ui/icons/InsertChartOutlinedRounded";
import RateReviewOutlinedIcon from "@material-ui/icons/RateReviewOutlined";
import { CancelTokenSource } from "axios";
import axios from "axios";
import { Link } from "react-router-dom";
import {
    closeInfoPage,
    setTabIndex,
} from "../../actions/actions";
import { setCategory } from "../../actions/getGuides";

import { IState } from "../../reducers";
import { categories, ITabCategory, tabIds } from "../ControlBar";
import ToggleList from "./ToggleList";

const ICONS: Array<{id: string, icon: JSX.Element} > = [
    {id: "data", icon: <InsertChartOutlinedRoundedIcon />},
    {id: "activities", icon: <InfoOutlinedIcon />},
    {id: "trips", icon: <RateReviewOutlinedIcon />},
];

interface IBottomNavProps extends IBottomNavStateProps {
    setCategory: (value: string, token: CancelTokenSource) => void;
    location: any;
    closeInfoPage: () => void;
    setTabIndex: (index: string) => void;
}

interface IBottomNavStateProps {
    index: string;
}

interface IBottomNavState {
    cancelToken: CancelTokenSource;
}

class BottomNav extends Component<IBottomNavProps, IBottomNavState> {
    constructor(props: IBottomNavProps) {
        super(props);
        this.state = {
            cancelToken: axios.CancelToken.source(),
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
            this.props.setCategory("activities", newToken);
            this.props.closeInfoPage();
        } else {
            this.props.setCategory(categoryId, newToken);
        }
    }

    public render(): JSX.Element {
        return (
            <div style={{width: "100%", marginTop: "auto"}}>
            <ToggleList/>
            <BottomNavigation
                value={tabIds.indexOf(this.props.index)}
                showLabels
                style={{width: "100%", minHeight: "60px", marginTop: "auto"}}
             >
                 {categories.map((item: ITabCategory) => (
                     <BottomNavigationAction
                        component={Link}
                        label={item.name}
                        icon={ICONS.filter(
                            (icon: {id: string, icon: JSX.Element}) => icon.id === item.id,
                            )[0].icon}
                        to={item.route}
                        onClick={(event: any): void => this.handleSelect(event, item.id)}
                    />
                 ))}
          </BottomNavigation>
          </div>
        );
    }
}

function mapStateToProps(state: IState): IBottomNavStateProps {
    return ({
        index: state.tabIndex,
    });
}

export default connect(
    mapStateToProps,
    { closeInfoPage, setTabIndex, setCategory },
)(BottomNav);
