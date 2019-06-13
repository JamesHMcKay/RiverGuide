import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { IState } from "../../reducers/index";

// import Modals
import Login from "../auth/Login";
import Logout from "../auth/Logout";
import Register from "../auth/Register";
import DataInfoModal from "../infoPanel/DataInfoModal";
import DownloadModal from "../infoPanel/DownloadModal";
import EditModal from "../infoPanel/EditModal";
import WeatherModal from "../infoPanel/WeatherModal";
import TripDetailsAnyPage from "../profile/TripDetailsAnyPage";
import TripDetailsInfoPage from "../profile/TripDetailsInfoPage";
import Success from "../utils/Success";
// import Create from "../create/Create";
// import CreateModal from "../create/CreateModal";

class Modals extends Component {
    public render(): JSX.Element {
        return (
            <div>
                <Success />
                <Logout />
                <Register />
                <Login />
                <TripDetailsInfoPage />
                <TripDetailsAnyPage />
                <WeatherModal />
                <EditModal />
                <DownloadModal />
                <DataInfoModal />
            </div>
        );
    }
}

function mapStateToProps(state: IState): {openModal: string} {
    return ({
        openModal: state.openModal,
    });
}

export default connect(
    mapStateToProps,
    { toggleModal },
)(Modals);
