import { Button, createStyles, DialogActions, DialogContent, DialogContentText, Theme } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { deleteGuide, updateGuide } from "../../actions/updateGuide";
import { IState } from "../../reducers/index";
import DialogTitle from "../../utils/dialogTitle";
import { IAuth, IInfoPage, IListEntry, IUser } from "../../utils/types";
import DraftGuide, { IDraftGuideState } from "../draftGuide/DraftGuide";
import EditGuide, { IEditGuideState } from "./EditGuide";

const styles: any = (theme: Theme): any => createStyles({
    dialogPaper: {
        minHeight: "80vh",
        maxHeight: "80vh",
    },
});

interface IEditModalProps extends IEditModalStateProps {
    toggleModal: (modal?: string) => void;
    updateGuide: (
        item: IDraftGuideState,
        selectedGuide: IListEntry,
        listEntries: IListEntry[],
        userRole: IUser,
    ) => void;
    deleteGuide: (selectedGuideId: string, listEntries: IListEntry[]) => void;
    classes: any;
}

interface IEditModalStateProps {
    isOpen: boolean;
    infoPage: IInfoPage;
    listEntries: IListEntry[];
    auth: IAuth;
}

class EditModal extends Component<IEditModalProps, {}> {
    constructor(props: IEditModalProps) {
        super(props);
        this.state = {
        };
    }

    public handleClose = (): void => {
        this.props.toggleModal();
    }

    public closeModal = (): void => {
        this.setState({thanksOpen: false});
        this.props.toggleModal();
    }

    public handleSave = (result: IDraftGuideState): void => {
        const selectedGuide: IListEntry = {
            ...this.props.infoPage.selectedGuide,
            display_name: result.displayName,
            river_name: result.riverName,
            region: result.region,
            gauge_id: result.gaugeId,
            position: result.locationMarker ? {
                lat: result.locationMarker.lat,
                lon: result.locationMarker.lng,
            } : this.props.infoPage.selectedGuide.position,
            activity: result.activity ? result.activity : this.props.infoPage.selectedGuide.activity,
        };
        this.props.updateGuide(result, selectedGuide, this.props.listEntries, this.props.auth.user);
    }

    public handleDelete = (): void => {
        this.props.deleteGuide(this.props.infoPage.selectedGuide.id, this.props.listEntries);
        this.closeModal();
    }

    public render(): JSX.Element {
        const { classes } = this.props;
        return (
            <Dialog
                onClose={(): void => this.props.toggleModal()}
                aria-labelledby="example dialog"
                open={this.props.isOpen}
                fullWidth={true}
                fullScreen={false}
                maxWidth={"md"}
                classes={{ paper: classes.dialogPaper }}
            >
                <DraftGuide
                    handleClose = {(): void => this.props.toggleModal()}
                    infoPage = {this.props.infoPage}
                    handleSave = {this.handleSave}
                    handleDelete = {this.handleDelete}
                    title={"Edit guide"}
                />
            </Dialog>
        );
    }
}

function mapStateToProps(state: IState): IEditModalStateProps {
    return ({
        isOpen: state.openModal === "editModal",
        infoPage: state.infoPage,
        listEntries: state.listEntries,
        auth: state.auth,
    });
}

export default connect(
    mapStateToProps,
    { toggleModal, updateGuide, deleteGuide },
)(withStyles(styles)(EditModal));
