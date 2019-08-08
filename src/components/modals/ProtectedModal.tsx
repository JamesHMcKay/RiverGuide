import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import TextField from "@material-ui/core/TextField";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { IState } from "../../reducers";
import DialogTitle from "../../utils/dialogTitle";

const password: string = "riverguidepreview";

interface IProtectedModalState {
    password: string;
}

interface IProtectedModalProps extends IProtectedModalStateProps {
    toggleModal: (modal?: string) => void;
    fullScreen: boolean;
}

interface IProtectedModalStateProps {
    isOpen: boolean;
}

class ContactModal extends Component<IProtectedModalProps, IProtectedModalState> {
    constructor(props: IProtectedModalProps) {
        super(props);
        this.state = {
            password: "",
        };
    }

    public handleClose = (): void => {
        if (this.state.password === password) {
            localStorage.setItem("previewAccess", "true");
            this.props.toggleModal();
        }
    }

    public render(): JSX.Element {
        return (
            <div>
                <Dialog
                    onClose={(): void => this.handleClose()}
                    open={this.props.isOpen}
                    fullScreen={this.props.fullScreen}
                    fullWidth={true}
                    maxWidth={"sm"}
                >
                <DialogTitle handleClose={this.handleClose} title={"Welcome to the RiverGuide"}/>
                <DialogContent>
                    <DialogContentText>
                        Thanks for trying the RiverGuide.  Please click the feedback link
                        at the top of the page (under "About") or in the side menu on a mobile and
                        let us know what you did and didn't like.
                    </DialogContentText>
                    <TextField
                            placeholder={"Enter the password you were given here"}
                            fullWidth
                            autoFocus
                            margin="dense"
                            id="people"
                            value={this.state.password}
                            onChange={(value: any): void => this.setState({password: value.target.value})}
                    />
                    <Button
                        variant = "contained"
                        color="primary"
                        onClick={this.handleClose}
                        disabled={this.state.password !== password}
                        fullWidth>
                                Submit
                    </Button>
                   </DialogContent>
                </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state: IState): IProtectedModalStateProps {
    return ({
        isOpen: state.openModal === "protectedModal",
    });
}

export default connect(
    mapStateToProps,
    { toggleModal},
)(withMobileDialog()(ContactModal));
