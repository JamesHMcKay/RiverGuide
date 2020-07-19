import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { deleteDraft } from "../../actions/updateGuide";
import { IState } from "../../reducers/index";
import DialogTitle from "../../utils/dialogTitle";
import { IInfoPage, IListEntry } from "../../utils/types";

interface IDeleteDraftModalProps extends IDeleteDraftModalStateProps {
    toggleModal: (modal?: string) => void;
    deleteDraft: (logId: string, guideDrafts: IListEntry[]) => void;
}

interface IDeleteDraftModalStateProps {
    isOpen: boolean;
    infoPage: IInfoPage;
    guideDrafts: IListEntry[];
}

class DeleteDraftModal extends Component<IDeleteDraftModalProps> {
    constructor(props: IDeleteDraftModalProps) {
        super(props);
        this.state = {};
    }

    public closeModal = (): void => {
        this.props.toggleModal();
    }

    public handleDelete(): void {
        this.props.deleteDraft(this.props.infoPage.selectedGuide.id, this.props.guideDrafts);
        this.props.toggleModal();
    }

    public render(): JSX.Element {
        return (
            <Dialog
            onClose={(): void => this.props.toggleModal()}
            open={this.props.isOpen}
            >
            <DialogTitle
                handleClose={(): void => this.props.toggleModal()}
                title={
                    "Delete submission?"
                }
            />
                <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete this guide submission?
                    If it has already been accepted deleting it will not remove the published version.
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

function mapStateToProps(state: IState): IDeleteDraftModalStateProps {
    return ({
        isOpen: state.openModal === "deleteDraft",
        infoPage: state.infoPage,
        guideDrafts: state.guideDrafts,
    });
}

export default connect(
    mapStateToProps,
    { deleteDraft, toggleModal },
)(DeleteDraftModal);
