import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";

// Material UI
import { CircularProgress, List } from "@material-ui/core";

// Components
import { IState } from "../../reducers/index";
import { IAuth, IGauge, IInfoPage, IListEntry } from "./../../utils/types";
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

    public render(): JSX.Element {
        const isAuthenticated: boolean = this.props.auth.isAuthenticated;
        const isLoading: boolean = this.props.filteredList.length < 1;

        const renderedList: JSX.Element = (
            <List>
                {this.props.specialItem && this.props.specialItem}
                {isAuthenticated && <ListGroup listEntries = {this.props.filteredList} region="Favourites" />}
                {this.props.filteredList
                    .map(this.getRegion)
                    .filter(this.onlyUnique)
                    .sort(this.sortAlphbetically)
                    .map(this.renderListGroup)}
            </List>
        );

        const loading: JSX.Element = (
            <div className="loader">
                <CircularProgress size={20} />
            </div>
        );

        return (
            <div className="list-container">
                {isLoading ? loading : renderedList}
            </div>
        );
    }
}

function mapStateToProps(state: IState): ILeftPanelStateProps {
    return ({
        auth: state.auth,
        infoPage: state.infoPage,
    });
}

export default connect(
    mapStateToProps,
    { toggleModal },
)(LeftPanel);
