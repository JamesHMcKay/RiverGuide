import { Button, createStyles, DialogActions, DialogContent, Theme, Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { deleteNotice } from "../../actions/getNotices";
import { IState } from "../../reducers/index";
import DialogTitle from "../../utils/dialogTitle";
import loadingButton from "../../utils/loadingButton";
import { IAuth, INotice } from "../../utils/types";

const styles: any = (theme: Theme): any => createStyles({
    dialogPaper: {
        minHeight: "60vh",
        maxHeight: "60vh",
    },
});

interface IDeleteNoticeProps extends IDeleteNoticeStateProps {
    toggleModal: (modal?: string) => void;
    deleteNotice: (id: string, guideId: string) => void;
    classes: any;
    noticeId: string;
    guideId: string;
}

interface IDeleteNoticeStateProps {
    auth: IAuth;
    loadingSpinner: string;
    notices: INotice[];
}

class DeleteNotice extends Component<IDeleteNoticeProps> {
    public handleClose = (): void => {
        this.props.toggleModal();
    }

    public closeModal = (): void => {
        this.props.toggleModal();
    }

    public handleDelete = (): void => {
        this.props.deleteNotice(this.props.noticeId, this.props.guideId);
    }

    public render(): JSX.Element {
        return (
            <div>
                <DialogTitle
                handleClose={(): void => this.props.toggleModal()}
                title={
                "Submit a hazard or information notice."
                }
                />
                <DialogContent>
                        <Typography gutterBottom>
                            Are you sure you want to delete this notice?
                        </Typography>
                </DialogContent>
                <DialogActions>
                <Button
                    onClick={this.closeModal}
                    color="primary"
                    variant={"outlined"}
                >Cancel</Button>
                    <div
                    style={{
                        margin: "1em",
                        position: "relative",
                    }}
                    >
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={(): void => this.handleDelete()}
                        disabled={this.props.loadingSpinner === "deleteNotice"}
                    >
                    Delete
                    </Button>
                    {this.props.loadingSpinner === "deleteNotice" && loadingButton()}
                    </div>
                </DialogActions>
                </div>
        );
    }
}

function mapStateToProps(state: IState): IDeleteNoticeStateProps {
    return ({
        auth: state.auth,
        loadingSpinner: state.loadingSpinner,
        notices: state.notices,
    });
}

export default connect(
    mapStateToProps,
    { toggleModal, deleteNotice },
)(withStyles(styles)(DeleteNotice));
