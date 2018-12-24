import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { deleteLogEntry, toggleModal } from "../../actions/actions";

import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";

class DeleteModal extends Component {
    constructor() {
        super();
        this.state = {};

        this.closeModal = this.closeModal.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    closeModal() {
        this.props.toggleModal();
    }

    handleDelete() {
        this.props.deleteLogEntry(this.props.openLog._id);
        this.props.toggleModal();
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.closeModal}>
                <ModalHeader toggle={this.closeModal}>
                    Delete this Log Entry?
                </ModalHeader>
                <ModalBody>
                    <Button onClick={this.handleDelete} color="danger">
                        Delete
                    </Button>{" "}
                    <Button onClick={this.closeModal}>Cancel</Button>
                </ModalBody>
            </Modal>
        );
    }
}

DeleteModal.propTypes = {
    toggleModal: PropTypes.func.isRequired,
    deleteLogEntry: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    isOpen: state.openModal === "deleteTrip",
    openLog: state.openLog
});

export default connect(
    mapStateToProps,
    { deleteLogEntry, toggleModal }
)(DeleteModal);
