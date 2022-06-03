import BottomNavigation from "@material-ui/core/BottomNavigation";
import BottomNavigationAction from "@material-ui/core/BottomNavigationAction";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import InsertChartOutlinedRoundedIcon from "@material-ui/icons/InsertChartOutlinedRounded";
import RateReviewOutlinedIcon from "@material-ui/icons/RateReviewOutlined";
import SubjectRoundedIcon from "@material-ui/icons/SubjectRounded";
import axios from "axios";
import { CancelTokenSource } from "axios";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
    closeInfoPage,
    setTabIndex,
} from "../../actions/actions";
import { setCategory, updateCategory } from "../../actions/getGuides";
import { IState } from "../../reducers";
import { IAuth, IFilter, IGauge, IListEntry, IMapBounds } from "../../utils/types";
import { categories, ITabCategory, tabIds } from "../ControlBar";
import ToggleList from "./ToggleList";

const ICONS: Array<{id: string, icon: JSX.Element} > = [
    {id: "riverflow", icon: <InsertChartOutlinedRoundedIcon />},
    {id: "guides", icon: <InfoOutlinedIcon />},
    {id: "all", icon: <SubjectRoundedIcon />},
    {id: "trips", icon: <RateReviewOutlinedIcon />},
];

interface IBottomNavProps extends IBottomNavStateProps {
    setCategory: (
        value: string,
        filter: IFilter,
        mapBounds: IMapBounds,
        token: CancelTokenSource) => void;
    updateCategory: (
        value: string,
        filter: IFilter,
        mapBounds: IMapBounds | null,
        guides: IListEntry[],
        gauges: IGauge[]) => void;
    closeInfoPage: () => void;
    setTabIndex: (index: string) => void;
}

interface IBottomNavStateProps {
    index: string;
    mapBounds: IMapBounds;
    filters: IFilter;
    guides: IListEntry[];
    gauges: IGauge[];
    auth: IAuth;
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
            // this.props.setCategory("activities", this.props.filters, null, newToken);
            this.props.updateCategory("guides", this.props.filters, null, this.props.guides, this.props.gauges);
            this.props.closeInfoPage();
        } else {
            // this.props.setCategory(categoryId, this.props.filters, null, newToken);
            this.props.updateCategory(categoryId, this.props.filters, null, this.props.guides, this.props.gauges);
        }
    }

    public render(): JSX.Element {
        const categoriesFiltered: ITabCategory[] = this.props.auth.isAuthenticated ?
            categories : categories.filter((item: ITabCategory) => !item.authOnly);
        return (
            <div style={{width: "100%", marginTop: "auto", position: "absolute", bottom: 0, zIndex: 1}}>
                <ToggleList/>
                <BottomNavigation
                    value={tabIds.indexOf(this.props.index)}
                    showLabels
                    style={{width: "100%", minHeight: "60px", marginTop: "auto"}}
                >
                    {categoriesFiltered.map((item: ITabCategory) => (
                        <BottomNavigationAction
                            key={item.name}
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
        mapBounds: state.mapBounds,
        filters: state.filters,
        guides: state.guides,
        gauges: state.gauges,
        auth: state.auth,
    });
}

export default connect(
    mapStateToProps,
    { closeInfoPage, setTabIndex, setCategory, updateCategory },
)(BottomNav);
