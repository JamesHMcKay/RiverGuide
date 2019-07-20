import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";

// Material UI
import { CircularProgress, List } from "@material-ui/core";

// Components
import { IState } from "../../reducers/index";
import { IAuth, IErrors, IFilter, IGauge, IInfoPage, IListEntry, IUserDetails } from "./../../utils/types";
import FavGroup from "./FavGroup";
// Styles
import "./LeftPanel.css";
import ListGroup from "./ListGroup";

interface ILeftPanelProps extends ILeftPanelStateProps {
    gaugeList: IGauge[];
    gauges: IGauge[];
    toggleModal: (name: string) => void;
    onClick: (guide: IListEntry) => void;
    filteredList: IListEntry[];
    specialItem?: JSX.Element;
}

interface ILeftPanelStateProps {
    auth: IAuth;
    infoPage: IInfoPage;
    userDetails: IUserDetails;
    listEntries: IListEntry[];
    filters: IFilter;
    recentItems: string[];
    errors: IErrors;
}

class LeftPanel extends Component<ILeftPanelProps, {}> {
    public getRegion = (guide: IListEntry): string => guide.region;

    public onlyUnique = (value: string, index: number, self: string[]): boolean => self.indexOf(value) === index;

    public sortAlphbetically = (a: string, b: string): number => {
        if (a < b) { return -1; }
        if (a > b) { return 1; }
        return 0;
    }

    public handleClick = (modalName: string): void => {
        this.props.toggleModal(modalName);
    }

    public renderListGroup = (region: string, idx: number): JSX.Element => <ListGroup
        listEntries = {this.props.filteredList} key={idx} region={region}
    />

    public loadingOrEmpty = (noResults: boolean): JSX.Element => {
        if (this.props.errors.message) {
            return (
                <div style={{width: "100%", paddingLeft: "10%", paddingTop: "30%"}}>
                    {"Request failed, refresh page and check your network connection."}
                </div>
            );
        }
        if (noResults) {
            return (
                <div className="noresults">
                    {"No results"}
                </div>
            );
        }
        return (
            <div className="loader">
                <CircularProgress size={20} />
            </div>
        );
    }

    public render(): JSX.Element {
        // const isAuthenticated: boolean = this.props.auth.isAuthenticated;
        const isLoading: boolean = this.props.listEntries.length < 1;
        const noResults: boolean = !isLoading && this.props.filteredList.length < 1;

        let favourites: string[] = [];
        if (this.props.auth.isAuthenticated && this.props.auth.user.user_favourites) {
            favourites = this.props.auth.user.user_favourites;
        } else if (!this.props.auth.isAuthenticated) {
            favourites = this.props.recentItems;
        }

        const favList: IListEntry[] = this.props.filteredList.filter(
            (item: IListEntry) => favourites.indexOf(item.id) > -1,
        );
        const renderedList: JSX.Element = (
            <List>
                {this.props.specialItem && this.props.specialItem}
                {(!noResults) && <FavGroup listEntries={favList}/>}
                {this.props.filteredList
                    .map(this.getRegion)
                    .filter(this.onlyUnique)
                    .sort(this.sortAlphbetically)
                    .map(this.renderListGroup)}
            </List>
        );

        return (
            <div className="list-container">
                {isLoading || noResults ? this.loadingOrEmpty(noResults) : renderedList}
            </div>
        );
    }
}

function mapStateToProps(state: IState): ILeftPanelStateProps {
    return ({
        auth: state.auth,
        infoPage: state.infoPage,
        userDetails: state.userDetails,
        listEntries: state.listEntries,
        filters: state.filters,
        recentItems: state.recentItems,
        errors: state.errors,
    });
}

export default connect(
    mapStateToProps,
    { toggleModal },
)(LeftPanel);
