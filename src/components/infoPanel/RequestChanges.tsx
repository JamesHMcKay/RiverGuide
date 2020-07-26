import {
    Button,
    createStyles,
    DialogActions,
    DialogContent,
    DialogContentText,
    TextField,
    Theme,
    Typography,
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { deleteGuide, updateDraftStatus } from "../../actions/updateGuide";
import { IState } from "../../reducers/index";
import DialogTitle from "../../utils/dialogTitle";
import loadingButton from "../../utils/loadingButton";
import { IAuth, IGuideDraftDetails, IInfoPage, IListEntry, IUser } from "../../utils/types";

const styles: any = (theme: Theme): any => createStyles({
    dialogPaper: {
        minHeight: "80vh",
        maxHeight: "80vh",
    },
});

interface IRequestChangesProps extends IRequestChangesStateProps {
    toggleModal: (modal?: string) => void;
    updateDraftStatus: (
        id: string, status: string, user: IUser, selectedGuide: IListEntry, comments: string,
    ) => void;
    deleteGuide: (selectedGuideId: string, listEntries: IListEntry[]) => void;
    classes: any;
    infoPage: IInfoPage;
    listEntries: IListEntry[];
}

interface IRequestChangesState {
    moderatorComments: string;
}

interface IRequestChangesStateProps {
    auth: IAuth;
    loadingSpinner: string;
}

class RequestChanges extends Component<IRequestChangesProps, IRequestChangesState> {
    constructor(props: IRequestChangesProps) {
        super(props);
        let moderatorComments: string = "";
        if (this.props.infoPage && this.props.infoPage.itemDetails && this.props.infoPage.itemDetails.draftDetails) {
            moderatorComments = this.props.infoPage.itemDetails.draftDetails.moderatorComments;
        }
        this.state = {
            moderatorComments,
        };
    }

    public handleClose = (): void => {
        this.props.toggleModal();
    }

    public closeModal = (): void => {
        this.props.toggleModal();
    }

    public handleSubmit = (): void => {
        const entry: IListEntry = this.props.infoPage.selectedGuide;
        this.props.updateDraftStatus(
            entry.id,
            "changes_required",
            this.props.auth.user,
            entry,
            this.state.moderatorComments,
        );
    }

    public handleTextChange = (event: any, field: keyof IRequestChangesState): void => {
        this.setState({
            ...this.state,
            [field]: event.target.value,
        });
    }

    public render(): JSX.Element {
        const draftDetails: IGuideDraftDetails | undefined = this.props.infoPage.itemDetails &&
            this.props.infoPage.itemDetails.draftDetails;
        return (
            <div>
                <DialogTitle
                handleClose={(): void => this.props.toggleModal()}
                title={
                "Request user changes"
                }
                />
                <DialogContent>
                        <Typography gutterBottom>
                            Requst that the user makes changes to their submission.  Add any comments into
                            box below.
                        </Typography>
                        <DialogContentText variant = "h5" color="textPrimary">
                        {"Comments"}
                        </DialogContentText>
                    <TextField
                            multiline
                            variant="outlined"
                            rowsMax="8"
                            rows="2"
                            margin="dense"
                            id="comments"
                            type="text"
                            value={this.state.moderatorComments || undefined}
                            onChange={(e: any): void => {this.handleTextChange(e, "moderatorComments"); }}
                            fullWidth={true}
                    />
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
                        onClick={(): void => this.handleSubmit()}
                        disabled={this.props.loadingSpinner === "updateDraftStatus"}
                    >
                    Submit
                    </Button>
                    {this.props.loadingSpinner === "updateDraftStatus" && loadingButton()}
                    </div>
                }
                </DialogActions>
                </div>
        );
    }
}

function mapStateToProps(state: IState): IRequestChangesStateProps {
    return ({
        auth: state.auth,
        loadingSpinner: state.loadingSpinner,
    });
}

export default connect(
    mapStateToProps,
    { toggleModal, updateDraftStatus, deleteGuide },
)(withStyles(styles)(RequestChanges));
