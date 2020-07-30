import { createStyles, Theme } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { deleteGuide, updateDraftStatus } from "../../actions/updateGuide";
import { IState } from "../../reducers/index";
import { IAuth, IInfoPage, IListEntry } from "../../utils/types";
import RequestChanges from "./RequestChanges";

const styles: any = (theme: Theme): any => createStyles({
    dialogPaper: {
        minHeight: "80vh",
        maxHeight: "80vh",
    },
});

interface IRequestChangesModalProps extends IRequestChangesModalStateProps {
    toggleModal: (modal?: string) => void;
    updateDraftStatus: (
        id: string, status: string, userId: string, selectedGuide: IListEntry, comments: string,
    ) => void;
    deleteGuide: (selectedGuideId: string, listEntries: IListEntry[]) => void;
    classes: any;
}

interface IRequestChangesModalStateProps {
    isOpen: boolean;
    infoPage: IInfoPage;
    listEntries: IListEntry[];
    auth: IAuth;
    loadingSpinner: string;
}

class RequestChangesModal extends Component<IRequestChangesModalProps> {
    public handleClose = (): void => {
        this.props.toggleModal();
    }

    public closeModal = (): void => {
        this.props.toggleModal();
    }

    public render(): JSX.Element {
        return (
            <Dialog
            onClose={(): void => this.props.toggleModal()}
            open={this.props.isOpen}
            >
                <RequestChanges infoPage={this.props.infoPage} listEntries={this.props.listEntries}/>
            </Dialog>
        );
    }
}

function mapStateToProps(state: IState): IRequestChangesModalStateProps {
    return ({
        isOpen: state.openModal === "requestChangesModal",
        infoPage: state.infoPage,
        listEntries: state.listEntries,
        auth: state.auth,
        loadingSpinner: state.loadingSpinner,
    });
}

export default connect(
    mapStateToProps,
    { toggleModal, updateDraftStatus, deleteGuide },
)(withStyles(styles)(RequestChangesModal));
