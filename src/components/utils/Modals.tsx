import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { IState } from "../../reducers/index";

import Login from "../auth/Login";
import Logout from "../auth/Logout";
import Register from "../auth/Register";
import DataInfoModal from "../infoPanel/DataInfoModal";
import DownloadModal from "../infoPanel/DownloadModal";
import EditModal from "../infoPanel/EditModal";
import WeatherModal from "../infoPanel/WeatherModal";
import TripDetailsAnyPage from "../profile/TripDetailsAnyPage";
import TripDetailsEdit from "../profile/TripDetailsEdit";
import TripDetailsInfoPage from "../profile/TripDetailsInfoPage";
import TripDetailsView from "../profile/TripDetailsView";
import ContactModal from "../modals/ContactModal";
import AboutModal from "../modals/AboutModal";

class Modals extends Component {
    public render(): JSX.Element {
        return (
            <div>
                <Logout />
                <Register />
                <Login />
                <TripDetailsInfoPage />
                <TripDetailsAnyPage />
                <WeatherModal />
                <EditModal />
                <DownloadModal />
                <DataInfoModal />
                <TripDetailsEdit />
                <TripDetailsView />
                <ContactModal />
                <AboutModal />
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
