import React, { Component } from "react";
import { connect } from "react-redux";
import { deleteLogEntry, toggleModal } from "../../actions/actions";
import { IState } from "../../reducers/index";
import { IOpenLog } from "../../utils/types";

import { Button, Modal, ModalBody, ModalHeader } from "reactstrap";

interface IDeleteModalProps extends IDeleteModalStateProps {
    toggleModal: (modal: string) => void;
    deleteLogEntry: (logId: string) => void;
}

interface IDeleteModalStateProps {
    isOpen: boolean;
    openLog: IOpenLog;
}

class DeleteModal extends Component<IDeleteModalProps> {
    constructor(props: IDeleteModalProps) {
        super(props);
        this.state = {};

        this.closeModal = this.closeModal.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    public closeModal(): void {
        this.props.toggleModal("deleteTrip");
    }

    public handleDelete(): void {
        this.props.deleteLogEntry(this.props.openLog._id);
        this.props.toggleModal("deleteTrip");
    }

    public render(): JSX.Element {
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

function mapStateToProps(state: IState): IDeleteModalStateProps {
    return ({
        isOpen: state.openModal === "deleteTrip",
        openLog: state.openLog,
    });
}

export default connect(
    mapStateToProps,
    { deleteLogEntry, toggleModal },
)(DeleteModal);
