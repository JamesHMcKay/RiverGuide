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

// Icons
// import { library } from "@fortawesome/fontawesome-svg-core";
// // import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faFilter } from "@fortawesome/free-solid-svg-icons";

// library.add(faFilter);

interface ILeftPanelProps {
    searchList: IGuide[];
    gaugeList: IGauge[];
    gauges: IGauge[];
    toggleModal: (name: string) => void;
    guides: IGuide[];
    filteredGuides: IGuide[];
    infoPage: IInfoPage;
    auth: IAuth;
    onClick: (guide: IGuide) => void;
}

class LeftPanel extends Component<ILeftPanelProps, {}> {
    public getRegion = (guide: IGuide) => guide.region;

    public onlyUnique = (value: string, index: number, self: string[]) => self.indexOf(value) === index;

    public sortAlphbetically = (a: string, b: string) => {
        if (a < b) { return -1; }
        if (a > b) { return 1; }
        return 0;
    }

    public handleClick = (modalName: string) => {
        this.props.toggleModal(modalName);
    }

    public renderListGroup = (region: string, idx: number) => <ListGroup key={idx} region={region} />;

    public render() {
        const { isAuthenticated } = this.props.auth;
        const isLoading = this.props.guides.length < 1;

        const renderedList = (
            <List>
                {isAuthenticated && <ListGroup region="Favourites" />}
                {this.props.filteredGuides
                    .map(this.getRegion)
                    .filter(this.onlyUnique)
                    .sort(this.sortAlphbetically)
                    .map(this.renderListGroup)}
            </List>
        );

        const loading = (
            <div className="loader">
                <CircularProgress size={20} />
            </div>
        );

        const buttons = (
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

const mapStateToProps = (state: IState) => ({
    auth: state.auth,
    guides: state.guides,
    infoPage: state.infoPage,
    filteredGuides: state.filteredList,
});

export default connect(
    mapStateToProps,
    { toggleModal },
)(LeftPanel);
