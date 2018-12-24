import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { State } from '../../reducers/index';

// import Modals
import Register from "../auth/Register";
import Login from "../auth/Login";
import Welcome from "../auth/Welcome";
import ChangePassword from "../auth/ChangePassword";
import Success from "../utils/Success";
import Logout from "../auth/Logout";
import TripDetailsModal from "../profile/TripDetailsModal";
import FiltersModal from "../list/FiltersModal";
// import Create from "../create/Create";
// import CreateModal from "../create/CreateModal";

class Modals extends Component {
    render() {
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
    toggleModal: PropTypes.func.isRequired
};

const mapStateToProps = (state: State) => ({
    openModal: state.openModal
});

export default connect(
    mapStateToProps,
    { toggleModal }
)(Modals);
