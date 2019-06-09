import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { IState } from "../../reducers/index";
import { IErrors  } from "../../utils/types";

interface IDataInfoModalStateProps {
    errors: IErrors;
    isOpen: boolean;
}

interface IDownloadModalProps extends IDataInfoModalStateProps {
    toggleModal: (modal?: string) => void;
}

class DataInfoModal extends Component<IDownloadModalProps> {
    constructor(props: IDownloadModalProps) {
        super(props);
    }

    // public componentWillReceiveProps = (nextProps: IDownloadModalProps): void => {
    //     if (nextProps.errors) {
    //     }
    // }

    public closeModal = (): void => {
        this.props.toggleModal();
    }

    public render(): JSX.Element {

        return (
            <div>
                <Dialog onClose={this.closeModal} aria-labelledby="example dialog" open={this.props.isOpen}>
                <DialogContent>
                    {"This data is sourced from"}
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.closeModal} color="primary">
                    Cancel
                    </Button>
                </DialogActions>
                </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state: IState): IDataInfoModalStateProps {
    return ({
        isOpen: state.openModal === "DataInfoModal",
        errors: state.errors,
    });
}

export default connect(
    mapStateToProps,
    { toggleModal},
)(DataInfoModal);
