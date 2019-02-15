import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";

import { toggleModal } from "../../actions/actions";

import { Modal, ModalHeader } from "reactstrap";
import { State } from "../../reducers/index";

interface ISuccessProps {
    toggleModal: (modal: string) => void;
    isOpen: boolean;
}

class Success extends Component<ISuccessProps> {
    constructor(props: ISuccessProps) {
        super(props);
    }

    public closeModal = () => {
        this.props.toggleModal("successModal");
    }

    public render() {
        return (
            <Modal isOpen={this.props.isOpen} toggle={this.closeModal}>
                <ModalHeader toggle={this.closeModal}>Success!</ModalHeader>
            </Modal>
        );
    }
}

Success.propTypes = {
    toggleModal: PropTypes.func.isRequired,
};

const mapStateToProps = (state: State) => ({
    isOpen: state.openModal === "successModal",
});

export default connect(
    mapStateToProps,
    { toggleModal },
)(Success);
