import { createStyles, Theme } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { deleteGuide, updateDraftStatus } from "../../actions/updateGuide";
import { IState } from "../../reducers/index";
import { IAuth, IInfoPage, IListEntry, INotice } from "../../utils/types";
import AddNotice from "./AddNotice";

const styles: any = (theme: Theme): any => createStyles({
    dialogPaper: {
        minHeight: "60vh",
        maxHeight: "60vh",
    },
});

interface IAddNoticeModalProps extends IAddNoticeModalStateProps {
    toggleModal: (modal?: string) => void;
    updateDraftStatus: (
        id: string, status: string, userId: string, selectedGuide: IListEntry, comments: string,
    ) => void;
    deleteGuide: (selectedGuideId: string, listEntries: IListEntry[]) => void;
    classes: any;
}

interface IAddNoticeModalStateProps {
    isOpen: boolean;
    infoPage: IInfoPage;
    auth: IAuth;
    loadingSpinner: string;
    notices: INotice[];
}

class AddNoticeModal extends Component<IAddNoticeModalProps> {
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
                <AddNotice infoPage={this.props.infoPage}/>
            </Dialog>
        );
    }
}

function mapStateToProps(state: IState): IAddNoticeModalStateProps {
    return ({
        isOpen: state.openModal === "addNoticeModal",
        infoPage: state.infoPage,
        notices: state.notices,
        auth: state.auth,
        loadingSpinner: state.loadingSpinner,
    });
}

export default connect(
    mapStateToProps,
    { toggleModal, updateDraftStatus, deleteGuide },
)(withStyles(styles)(AddNoticeModal));
