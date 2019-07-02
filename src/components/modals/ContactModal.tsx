import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { IState } from "../../reducers";
import DialogTitle from "../../utils/dialogTitle";

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
                        RiverGuide is developed and mainted by Environmental Insights New Zealand.
                        If you have suggestions, feedback or would like to get in touch
                        please send us a message and we will respond as soon as we can.
                    </p>
                    </DialogContentText>
                   </DialogContent>
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
