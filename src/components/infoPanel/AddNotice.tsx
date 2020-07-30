import {
    Button,
    createStyles,
    DialogActions,
    DialogContent,
    DialogContentText,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    TextField,
    Theme,
    Typography,
} from "@material-ui/core";
import Select from "@material-ui/core/Select";
import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { addNotice } from "../../actions/getNotices";
import { IState } from "../../reducers/index";
import DialogTitle from "../../utils/dialogTitle";
import loadingButton from "../../utils/loadingButton";
import { IAuth, IInfoPage, INotice, INoticeSubmission } from "../../utils/types";

const PRIORITY_OPTIONS: string[] = ["Information", "Warning", "Hazard"];

const styles: any = (theme: Theme): any => createStyles({
    dialogPaper: {
        minHeight: "60vh",
        maxHeight: "60vh",
    },
});

interface IAddNoticeProps extends IAddNoticeStateProps {
    toggleModal: (modal?: string) => void;
    addNotice: (item: INoticeSubmission, id?: string) => void;
    classes: any;
    infoPage: IInfoPage;
    noticeId?: string;
}

interface IAddNoticeState {
    description: string;
    priority: string;
    endDate?: string;
}

interface IAddNoticeStateProps {
    auth: IAuth;
    loadingSpinner: string;
    notices: INotice[];
}

class AddNotice extends Component<IAddNoticeProps, IAddNoticeState> {
    constructor(props: IAddNoticeProps) {
        super(props);
        if (this.props.noticeId) {
            const notice: INotice = this.props.notices.filter((item: INotice) => item.id === this.props.noticeId)[0];
            this.state = {
                description: notice.description,
                priority: notice.priority,
            };
        } else {
            this.state = {
                description: "",
                priority: "",
            };
        }
    }

    public handleClose = (): void => {
        this.props.toggleModal();
    }

    public closeModal = (): void => {
        this.props.toggleModal();
    }

    public handleSubmit = (): void => {
        const item: INoticeSubmission = {
            ...this.state,
            userId: this.props.auth.user.id,
            userName: this.props.auth.user.username,
            guideId: this.props.infoPage.selectedGuide.id,
            status: "new",
            active: true,
        };
        this.props.addNotice(item, this.props.noticeId);
    }

    public handleTextChange = (event: any, field: keyof IAddNoticeState): void => {
        this.setState({
            ...this.state,
            [field]: event.target.value,
        });
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
                            Please give details in the box below, this will be posted on the guide immediately.
                            If you are signed in then you can edit your notice, otherwise it will not be possible
                            without contacting us to have it edited or removed.
                        </Typography>
                        {!this.props.auth.isAuthenticated &&
                            <Typography gutterBottom style={{backgroundColor: "orange"}}>
                              Warning: Since you are not logged in you will not be able to edit or remove your notice.
                              If required, you may contact us to have it removed or edited.
                            </Typography>
                        }

                        <DialogContentText variant = "h5" color="textPrimary">
                        {"Description"}
                        </DialogContentText>
                    <TextField
                            multiline
                            variant="outlined"
                            rowsMax="8"
                            rows="2"
                            margin="dense"
                            id="comments"
                            type="text"
                            value={this.state.description || undefined}
                            onChange={(e: any): void => {this.handleTextChange(e, "description"); }}
                            fullWidth={true}
                    />
                    <DialogContentText variant = "h5" color="textPrimary">
                        {"Priority"}
                    </DialogContentText>
                    <FormControl variant="outlined" style={{width: "200px", paddingBottom: "20px"}}>
                    <InputLabel htmlFor="region-selector">
                        Priority
                    </InputLabel>
                    <Select
                        value={this.state.priority}
                        onChange={(e: any): void => {this.setState({
                            priority: e.target.value,
                            }); }}
                        input={<OutlinedInput labelWidth={50} name="Priority" id="region-selector"/>}
                    >
                    {PRIORITY_OPTIONS.map((item: string) => (
                        <MenuItem key={item} value={item}>{item}</MenuItem>
                    ))}
                    </Select>
                </FormControl>
                </DialogContent>
                <DialogActions>
                <Button
                    onClick={this.closeModal}
                    color="primary"
                    variant={"outlined"}
                >Close</Button>
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
                        disabled={this.props.loadingSpinner === "submitNotice"}
                    >
                    Submit
                    </Button>
                    {this.props.loadingSpinner === "submitNotice" && loadingButton()}
                    </div>
                </DialogActions>
                </div>
        );
    }
}

function mapStateToProps(state: IState): IAddNoticeStateProps {
    return ({
        auth: state.auth,
        loadingSpinner: state.loadingSpinner,
        notices: state.notices,
    });
}

export default connect(
    mapStateToProps,
    { toggleModal, addNotice },
)(withStyles(styles)(AddNotice));
