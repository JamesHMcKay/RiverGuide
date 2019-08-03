import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import content from "../../content/contact_modal_content.json";
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
                    fullWidth
                    maxWidth={"xs"}
                >
                <DialogTitle handleClose={this.handleClose} title={"Feedback"}/>
                <DialogContent style={{padding: "30px"}}>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: content.contact_modal_content,
                        }}
                    />
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
