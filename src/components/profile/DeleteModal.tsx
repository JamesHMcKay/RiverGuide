import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import React, { Component } from "react";
import { connect } from "react-redux";
import { deleteLogEntry, toggleModal } from "../../actions/actions";
import { IState } from "../../reducers/index";
import DialogTitle from "../../utils/dialogTitle";
import { IOpenLog } from "../../utils/types";

interface IDeleteModalProps extends IDeleteModalStateProps {
    toggleModal: (modal?: string) => void;
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
            <Dialog
            onClose={(): void => this.props.toggleModal()}
            open={this.props.isOpen}
            >
            <DialogTitle handleClose={(): void => this.props.toggleModal()} title={"Delete entry?"}/>
                <DialogContent>
                <DialogContentText>
                    Are you sure you want to delete this log entry?
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={this.closeModal} color="primary" variant="outlined">Cancel</Button>
                    <Button onClick={(): void => this.handleDelete()} color="primary" variant="outlined">
                        Delete
                    </Button>{" "}
                </DialogActions>
            </Dialog>
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
