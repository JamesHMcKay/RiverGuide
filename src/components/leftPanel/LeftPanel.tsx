import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";

// Material UI
import { Button, CircularProgress, List, Tooltip } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

// Components
import { IState } from "../../reducers/index";
import { IAuth, IGauge, IGuide, IInfoPage, IListEntry } from "./../../utils/types";
// Styles
import "./LeftPanel.css";
import ListGroup from "./ListGroup";

interface ILeftPanelProps extends ILeftPanelStateProps {
    gaugeList: IGauge[];
    gauges: IGauge[];
    toggleModal: (name: string) => void;
    onClick: (guide: IListEntry) => void;
}

interface ILeftPanelStateProps {
    auth: IAuth;
    guides: IGuide[];
    filteredGuides: IListEntry[];
    infoPage: IInfoPage;
    listEntries: IListEntry[];
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

    public renderListGroup = (region: string, idx: number): JSX.Element => <ListGroup key={idx} region={region} />;

    public render(): JSX.Element {
        const isAuthenticated: boolean = this.props.auth.isAuthenticated;
        const isLoading: boolean = this.props.listEntries.length < 1;

        const renderedList: JSX.Element = (
            <List>
                {isAuthenticated && <ListGroup region="Favourites" />}
                {this.props.filteredGuides
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

LeftPanel.propTypes = {
    auth: PropTypes.object.isRequired,
};

function mapStateToProps(state: IState): ILeftPanelStateProps {
    return ({
        auth: state.auth,
        guides: state.guides,
        infoPage: state.infoPage,
        filteredGuides: state.filteredList,
        listEntries: state.listEntries,
    });
}

export default connect(
    mapStateToProps,
    { toggleModal },
)(LeftPanel);
