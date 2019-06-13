import Dialog from "@material-ui/core/Dialog";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { IState } from "../../reducers/index";
import { IInfoPage } from "../../utils/types";
import EditGuide from "./EditGuide";

interface IEditModalProps extends IEditModalStateProps {
    toggleModal: (modal?: string) => void;
}

interface IEditModalStateProps {
    isOpen: boolean;
    infoPage: IInfoPage;
}

class EditModal extends Component<IEditModalProps> {
    public handleClose = (): void => {
        this.props.toggleModal();
    }

    public closeModal(): void {
        this.props.toggleModal();
    }

    public render(): JSX.Element {
        return (
            <Dialog
                onClose={(): void => this.props.toggleModal()}
                aria-labelledby="example dialog"
                open={this.props.isOpen}
                fullWidth={true}
                fullScreen={true}
            >
                <EditGuide
                    handleClose = {(): void => this.props.toggleModal()}
                    infoPage = {this.props.infoPage}
                />
            </Dialog>
        );
    }
}

function mapStateToProps(state: IState): IEditModalStateProps {
    return ({
        isOpen: state.openModal === "editModal",
        infoPage: state.infoPage,
    });
}

export default connect(
    mapStateToProps,
    { toggleModal},
)(EditModal);
