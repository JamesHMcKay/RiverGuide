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
import Welcome from "../auth/Welcome";
import FiltersModal from "../list/FiltersModal";
import TripDetailsModal from "../profile/TripDetailsModal";
import Success from "../utils/Success";
// import Create from "../create/Create";
// import CreateModal from "../create/CreateModal";

class Modals extends Component {
    public render() {
        return (
            <div>
                <ChangePassword />
                <Success />
                <Logout />
                <Register />
                <Login />
                <Welcome />
                <TripDetailsModal />
                <FiltersModal />
                {/* <Create /> */}
                {/* <CreateModal /> */}
            </div>
        );
    }
}

Modals.propTypes = {
    toggleModal: PropTypes.func.isRequired,
};

const mapStateToProps = (state: IState) => ({
    openModal: state.openModal,
});

export default connect(
    mapStateToProps,
    { toggleModal },
)(Modals);
