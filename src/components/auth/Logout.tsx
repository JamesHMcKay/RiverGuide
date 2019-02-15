import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { State } from "../../reducers/index";

import { logoutUser, toggleModal } from "../../actions/actions";

import { Button, Form, Modal, ModalFooter, ModalHeader } from "reactstrap";

interface ILogoutProps {
    logoutUser: () => void;
    toggleModal: (modal?: string) => void;
    isOpen: boolean;
}

class Logout extends Component<ILogoutProps> {
    constructor(props: ILogoutProps) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.onLogoutClick = this.onLogoutClick.bind(this);
    }

    public onLogoutClick(e: any) {
        e.preventDefault();
        this.props.logoutUser();
    }

    public closeModal() {
        this.props.toggleModal();
    }

    public onSubmit(e: any) {
        e.preventDefault();
    }

    public render() {
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
    logoutUser: PropTypes.func.isRequired,
};

const mapStateToProps = (state: State) => ({
    isOpen: state.openModal === "logoutModal",
});

export default connect(
    mapStateToProps,
    { toggleModal, logoutUser },
)(Logout);
