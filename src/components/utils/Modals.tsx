import React, { Component } from "react";
import { connect } from "react-redux";
import { IState } from "../../reducers/index";

import Login from "../auth/Login";
import Logout from "../auth/Logout";
import Register from "../auth/Register";
import AddModal from "../infoPanel/AddModal";
import DataInfoModal from "../infoPanel/DataInfoModal";
import DownloadModal from "../infoPanel/DownloadModal";
import EditModal from "../infoPanel/EditModal";
import WeatherModal from "../infoPanel/WeatherModal";
import MapModal from "../map/MapModal";
import AboutModal from "../modals/AboutModal";
import ContactModal from "../modals/ContactModal";
import TripDetailsAnyPage from "../profile/TripDetailsAnyPage";
import TripDetailsEdit from "../profile/TripDetailsEdit";
import TripDetailsInfoPage from "../profile/TripDetailsInfoPage";
import TripDetailsView from "../profile/TripDetailsView";

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
                <AddModal />
                <DownloadModal />
                <DataInfoModal />
                <TripDetailsEdit />
                <TripDetailsView />
                <ContactModal />
                <AboutModal />
                <MapModal />
            </div>
        );
    }
}

function mapStateToProps(state: IState): {openModal: string} {
    return ({
        openModal: state.openModal,
    });
}

export default connect(mapStateToProps)(Modals);
