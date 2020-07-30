import {
    Button,
    createStyles,
    DialogActions,
    DialogContent,
    Theme,
    Typography,
} from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { acceptDraft, deleteGuide } from "../../actions/updateGuide";
import { IState } from "../../reducers/index";
import DialogTitle from "../../utils/dialogTitle";
import loadingButton from "../../utils/loadingButton";
import { IAuth, IGuideDraftDetails, IInfoPage, IItemDetails, IListEntry, IUser } from "../../utils/types";

const styles: any = (theme: Theme): any => createStyles({
    dialogPaper: {
        minHeight: "80vh",
        maxHeight: "80vh",
    },
});

interface IAcceptDraftProps extends IAcceptDraftStateProps {
    toggleModal: (modal?: string) => void;
    acceptDraft: (
        item: IItemDetails,
        listEntries: IListEntry[],
        existingGuide: boolean,
        selectedGuide: IListEntry,
        user: IUser,
    ) => void;
    deleteGuide: (selectedGuideId: string, listEntries: IListEntry[]) => void;
    classes: any;
}

interface IAcceptDraftStateProps {
    isOpen: boolean;
    infoPage: IInfoPage;
    listEntries: IListEntry[];
    auth: IAuth;
    loadingSpinner: string;
}

class AcceptDraft extends Component<IAcceptDraftProps, {}> {
    constructor(props: IAcceptDraftProps) {
        super(props);
        this.state = {
        };
    }

    public handleClose = (): void => {
        this.props.toggleModal();
    }

    public closeModal = (): void => {
        this.props.toggleModal();
    }

    public handleAccept = (existingGuideIndex: number, draftDetails: IGuideDraftDetails): void => {
        const entry: IListEntry = this.props.infoPage.selectedGuide;
        const itemDetails: IItemDetails = this.props.infoPage.itemDetails;
        this.props.acceptDraft(
            itemDetails,
            this.props.listEntries,
            existingGuideIndex >= 0,
            entry,
            this.props.auth.user,
        );
    }

    public render(): JSX.Element {
        const draftDetails: IGuideDraftDetails | undefined = this.props.infoPage.itemDetails &&
            this.props.infoPage.itemDetails.draftDetails;
        let existingGuideIndex: number = -1;
        if (draftDetails) {
            existingGuideIndex = this.props.listEntries.map((item: IListEntry) => item.id).indexOf(draftDetails.appId);
        }

        return (
            <Dialog
            onClose={(): void => this.props.toggleModal()}
            open={this.props.isOpen}
            >
                <DialogTitle
                handleClose={(): void => this.props.toggleModal()}
                title={
                "Accept draft guide"
                }
                />
                <DialogContent>
                {(existingGuideIndex >= 0 && draftDetails) ?
                    <DialogContent>
                        <Typography gutterBottom>
                            This draft is an edit of an original guide, accepting it will
                            overwrite the guide with the following details:
                        </Typography>
                        <Typography gutterBottom style={{fontWeight: 600}} align="center">
                        ID: {draftDetails.appId}
                        </Typography>
                        <Typography gutterBottom style={{fontWeight: 600}} align="center">
                        Title: {this.props.listEntries[existingGuideIndex].display_name}
                        </Typography>
                        <Typography gutterBottom style={{fontWeight: 600}} align="center">
                        River: {this.props.listEntries[existingGuideIndex].river_name}
                        </Typography>
                        <Typography gutterBottom>
                            Please be sure you want to overwrite.
                        </Typography>
                    </DialogContent> :
                    <DialogContent>
                    <Typography gutterBottom>
                        This will create a new guide, please ensure that the user hasn't created a
                        duplicate of an existing guide.
                    </Typography>
                </DialogContent>
                }
                </DialogContent>
                <DialogActions>
                <Button
                    onClick={this.closeModal}
                    color="primary"
                    variant={(draftDetails && draftDetails.status !== "accepted") ? "outlined" : "contained"}
                >Close</Button>
                {draftDetails &&
                    <div
                    style={{
                        margin: "1em",
                        position: "relative",
                    }}
                    >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={(): void => this.handleAccept(existingGuideIndex, draftDetails)}
                        disabled={
                            this.props.loadingSpinner === "acceptDraftGuide" ||
                            draftDetails.status === "accepted"}
                    >
                    { draftDetails.status === "accepted" ? "Accepted" : "Accept"}
                    </Button>
                    {this.props.loadingSpinner === "acceptDraftGuide" && loadingButton()}
                    </div>
                }
                </DialogActions>
            </Dialog>
        );
    }
}

function mapStateToProps(state: IState): IAcceptDraftStateProps {
    return ({
        isOpen: state.openModal === "acceptDraft",
        infoPage: state.infoPage,
        listEntries: state.listEntries,
        auth: state.auth,
        loadingSpinner: state.loadingSpinner,
    });
}

export default connect(
    mapStateToProps,
    { toggleModal, acceptDraft, deleteGuide },
)(withStyles(styles)(AcceptDraft));
