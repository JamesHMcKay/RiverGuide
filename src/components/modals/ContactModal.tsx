import Dialog from "@material-ui/core/Dialog";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Button from "@material-ui/core/Button";
import DialogTitle from "../../utils/dialogTitle";
import { IState } from "../../reducers";

interface IContactModalProps extends IContactModalPropsStateProps {
    toggleModal: (modal?: string) => void;
    fullScreen: boolean;
}

interface IContactModalPropsStateProps {
    isOpen: boolean;
}

class ContactModal extends Component<IContactModalProps> {
    public handleClose = (): void => {
        this.props.toggleModal();
    }

    public render(): JSX.Element {
        return (
            <div>
                <Dialog
                    onClose={(): void => this.props.toggleModal()}
                    open={this.props.isOpen}
                    fullScreen={this.props.fullScreen}
                    fullWidth={true}
                    maxWidth={"sm"}
                >
                <DialogTitle handleClose={this.handleClose} title={"Contact Us"}/>
                <DialogContent>
                    <DialogContentText>
                    <p>
                        Do you have suggestions for the site?
                        Or is there bugs that need fixing?
                        Please send us a message and we will respond as soon as we can.
                    </p>
                    </DialogContentText>
                   </DialogContent>
                    <Button
                        variant = "contained"
                        color="primary"
                        onClick={this.handleClose}
                        fullWidth>
                                Close
                    </Button>
                </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state: IState): IContactModalPropsStateProps {
    return ({
        isOpen: state.openModal === "contactModal",
    });
}

export default connect(
    mapStateToProps,
    { toggleModal},
)(withMobileDialog()(ContactModal));
