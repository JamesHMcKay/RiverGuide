import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";

// Material UI
import { Button, CircularProgress, List, Tooltip } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";

// Components
import { IState } from "../../reducers/index";
import { IAuth, IGauge, IGuide, IInfoPage } from "./../../utils/types";
// Styles
import "./LeftPanel.css";
import ListGroup from "./ListGroup";

interface ILeftPanelProps extends ILeftPanelStateProps {
    searchList: IGuide[];
    gaugeList: IGauge[];
    gauges: IGauge[];
    toggleModal: (name: string) => void;
    onClick: (guide: IGuide) => void;
}

interface ILeftPanelStateProps {
    auth: IAuth;
    guides: IGuide[];
    filteredGuides: IGuide[];
    infoPage: IInfoPage;
}

class LeftPanel extends Component<ILeftPanelProps, {}> {
    public getRegion = (guide: IGuide): string => guide.region;

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
        const isAuthenticated: IAuth = this.props.auth;
        const isLoading: boolean = this.props.guides.length < 1;

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

        const buttons: JSX.Element = (
            <div>
                <div className="add-icon">
                    <Tooltip title="Add a Guide" placement="right">
                        <Button
                            onClick={this.handleClick.bind(this, "createModal")}
                            variant="fab"
                            color="primary"
                        >
                            <AddIcon />
                        </Button>
                    </Tooltip>
                </div>
                <div className="filter-icon">
                    <Tooltip title="Filter Guides" placement="right">
                        <Button
                            onClick={this.handleClick.bind(this, "filterModal")}
                            variant="fab"
                            color="primary"
                        >
                            {/* <FontAwesomeIcon icon="filter" /> */}
                        </Button>
                    </Tooltip>
                </div>
            </div>
        );

        return (
            <div className="list-container">
                {Object.keys(this.props.infoPage).length === 0}
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
    });
}

export default connect(
    mapStateToProps,
    { toggleModal },
)(LeftPanel);
