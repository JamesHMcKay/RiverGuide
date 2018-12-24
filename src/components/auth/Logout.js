import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { toggleModal, logoutUser } from "../../actions/actions";

import { Button, Form, Modal, ModalFooter, ModalHeader } from "reactstrap";

class Logout extends Component {
    constructor() {
        super();

        this.closeModal = this.closeModal.bind(this);
        this.onLogoutClick = this.onLogoutClick.bind(this);
    }

    onLogoutClick(e) {
        e.preventDefault();
        this.props.logoutUser();
    }

    closeModal() {
        this.props.toggleModal();
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.closeModal}>
                <ModalHeader toggle={this.closeModal}>
                    See You Again Soon
                </ModalHeader>
                <Form onSubmit={this.onSubmit}>
                    <ModalFooter>
                        <Button color="primary" onClick={this.onLogoutClick}>
                            Logout
                        </Button>{" "}
                        <Button color="secondary" onClick={this.closeModal}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>
        );
    }
}

Logout.propTypes = {
    toggleModal: PropTypes.func.isRequired,
    logoutUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    isOpen: state.openModal === "logoutModal"
});

export default connect(
    mapStateToProps,
    { toggleModal, logoutUser }
)(Logout);
