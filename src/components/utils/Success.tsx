import React, { Component } from "react";
import { connect } from "react-redux";

import { toggleModal } from "../../actions/actions";

import { Modal, ModalHeader } from "reactstrap";
import { IState } from "../../reducers/index";

interface ISuccessProps extends ISuccessStateProps {
    toggleModal: (modal: string) => void;
}

interface ISuccessStateProps {
    isOpen: boolean;
}

class Success extends Component<ISuccessProps> {
    public closeModal = (): void => {
        this.props.toggleModal("successModal");
    }

    public render(): JSX.Element {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.closeModal}>
                <ModalHeader toggle={this.closeModal}>Success!</ModalHeader>
            </Modal>
        );
    }
}

function mapStateToProps(state: IState): ISuccessStateProps {
    return ({
        isOpen: state.openModal === "successModal",
    });
}

export default connect(
    mapStateToProps,
    { toggleModal },
)(Success);
