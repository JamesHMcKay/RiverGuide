import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
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
                    maxWidth={"md"}
                >
                <DialogTitle handleClose={this.handleClose} title={"Feedback"}/>
                <DialogContent>
                    <div
                        dangerouslySetInnerHTML={{
// tslint:disable-next-line
                            __html: '<iframe src="https://docs.google.com/forms/d/e/1FAIpQLScjBWEdKvHhQrHyMKk1mj1wiij9bwXuDvePTcYUmhETaW5vVA/viewform?embedded=true" width="100%" height="1570" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>',
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
