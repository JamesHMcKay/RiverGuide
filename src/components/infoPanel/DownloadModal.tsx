import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { loginUser, registerUser } from "../../actions/getAuth";
import { IState } from "../../reducers/index";
import { IErrors, ILoginDetails, IRegisterData } from "../../utils/types";
import DownloadModalBody from "./DownloadModalBody";

interface IDownloadModalState {
    identifier: string;
    password: string;
    showPassword: boolean;
    errors?: IErrors;
    loading: boolean;
}

interface IDownloadModalStateProps {
    errors: IErrors;
    isOpen: boolean;
}

interface IDownloadModalProps extends IDownloadModalStateProps {
    toggleModal: (modal?: string) => void;
    loginUser: (details: ILoginDetails) => void;
    registerUser: (userData: IRegisterData) => void;
}

class DownloadModal extends Component<IDownloadModalProps, IDownloadModalState> {
    constructor(props: IDownloadModalProps) {
        super(props);
        this.state = {
            identifier: "",
            password: "",
            showPassword: false,
            loading: false,
        };
    }

    public componentWillReceiveProps = (nextProps: IDownloadModalProps): void => {
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors,
                loading: false,
            });
        }
    }

    public closeModal = (): void => {
        this.props.toggleModal();
    }

    public render(): JSX.Element {

        return (
            <div>
                <Dialog onClose={this.closeModal} aria-labelledby="example dialog" open={this.props.isOpen}>
                <DialogContent>
                    <DownloadModalBody/>
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

function mapStateToProps(state: IState): IDownloadModalStateProps {
    return ({
        isOpen: state.openModal === "DownloadModal",
        errors: state.errors,
    });
}

export default connect(
    mapStateToProps,
    { toggleModal, loginUser, registerUser},
)(DownloadModal);
