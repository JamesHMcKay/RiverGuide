import React, { Component } from "react";
import { connect } from "react-redux";
import { IState } from "../../reducers/index";

import { toggleModal } from "../../actions/actions";
import { logoutUser } from "../../actions/getAuth";

import { Button, Form, Modal, ModalFooter, ModalHeader } from "reactstrap";

interface ILogoutProps extends ILogoutStateProps {
    logoutUser: () => void;
    toggleModal: (modal?: string) => void;
}

interface ILogoutStateProps {
    isOpen: boolean;
}

class Logout extends Component<ILogoutProps> {
    constructor(props: ILogoutProps) {
        super(props);
        this.closeModal = this.closeModal.bind(this);
        this.onLogoutClick = this.onLogoutClick.bind(this);
    }

    public onLogoutClick(e: any): void {
        e.preventDefault();
        this.props.logoutUser();
    }

    public closeModal(): void {
        this.props.toggleModal();
    }

    public onSubmit(e: any): void {
        e.preventDefault();
    }

    public render(): JSX.Element {
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

function mapStateToProps(state: IState): ILogoutStateProps {
    return ({
        isOpen: state.openModal === "logoutModal",
    });
}

export default connect(
    mapStateToProps,
    { toggleModal, logoutUser },
)(Logout);
