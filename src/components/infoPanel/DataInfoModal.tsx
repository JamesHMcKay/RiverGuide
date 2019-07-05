import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { IState } from "../../reducers/index";
import DialogTitle from "../../utils/dialogTitle";
import { IErrors  } from "../../utils/types";

interface IDataInfoModalStateProps {
    errors: IErrors;
    isOpen: boolean;
    gaugeDisclaimer: string;
}

interface IDownloadModalProps extends IDataInfoModalStateProps {
    toggleModal: (modal?: string) => void;
}

class DataInfoModal extends Component<IDownloadModalProps> {
    public closeModal = (): void => {
        this.props.toggleModal();
    }

    public render(): JSX.Element {
        return (
            <Dialog
                onClose={this.closeModal}
                aria-labelledby="example dialog"
                open={this.props.isOpen}
                fullWidth
            >
            <DialogTitle handleClose={this.closeModal} title={"Disclaimer"}/>
            <DialogContent>
                {this.props.gaugeDisclaimer}
            </DialogContent>
            </Dialog>
        );
    }
}

function mapStateToProps(state: IState): IDataInfoModalStateProps {
    return ({
        isOpen: state.openModal === "DataInfoModal",
        errors: state.errors,
        gaugeDisclaimer: state.gaugeDisclaimer,
    });
}

export default connect(
    mapStateToProps,
    { toggleModal},
)(DataInfoModal);
