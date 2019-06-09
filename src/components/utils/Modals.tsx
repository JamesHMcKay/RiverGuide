import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { IState } from "../../reducers/index";

// import Modals
import ChangePassword from "../auth/ChangePassword";
import Login from "../auth/Login";
import Logout from "../auth/Logout";
import Register from "../auth/Register";
import DataInfoModal from "../infoPanel/DataInfoModal";
import DownloadModal from "../infoPanel/DownloadModal";
import EditModal from "../infoPanel/EditModal";
import WeatherModal from "../infoPanel/WeatherModal";
import FiltersModal from "../list/FiltersModal";
import TripDetailsAnyPage from "../profile/TripDetailsAnyPage";
import TripDetailsInfoPage from "../profile/TripDetailsInfoPage";
import Success from "../utils/Success";
// import Create from "../create/Create";
// import CreateModal from "../create/CreateModal";

class Modals extends Component {
    public render(): JSX.Element {
        return (
            <div>
                <ChangePassword />
                <Success />
                <Logout />
                <Register />
                <Login />
                <TripDetailsInfoPage />
                <TripDetailsAnyPage />
                <FiltersModal />
                <WeatherModal />
                <EditModal />
                <DownloadModal />
                <DataInfoModal />
            </div>
        );
    }
}

Modals.propTypes = {
    toggleModal: PropTypes.func.isRequired,
};

function mapStateToProps(state: IState): {openModal: string} {
    return ({
        openModal: state.openModal,
    });
}

export default connect(
    mapStateToProps,
    { toggleModal },
)(Modals);
