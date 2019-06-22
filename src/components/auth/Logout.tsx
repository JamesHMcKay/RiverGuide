import React, { Component } from "react";
import { connect } from "react-redux";
import { IState } from "../../reducers/index";

import { toggleModal } from "../../actions/actions";
import { logoutUser } from "../../actions/getAuth";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";

interface ILogoutProps extends ILogoutStateProps {
    logoutUser: () => void;
    toggleModal: (modal?: string) => void;
}

interface ILogoutStateProps {
    isOpen: boolean;
}

class Logout extends Component<ILogoutProps> {
    public onLogoutClick = (e: any): void => {
        e.preventDefault();
        this.props.logoutUser();
    }

    public onSubmit(e: any): void {
        e.preventDefault();
    }

    public render(): JSX.Element {
        return (
            <Dialog
                onClose={(): void => this.props.toggleModal()}
                open={this.props.isOpen}
            >
                <DialogContent>Are you sure you want to logout?</DialogContent>
                <DialogActions>
                    <Button variant="outlined" onClick={(): void => this.props.toggleModal()} color="primary">
                        Cancel
                    </Button>
                    <Button variant="outlined" onClick={this.onLogoutClick} color="primary">
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

function mapStateToProps(state: IState): ILogoutStateProps {
    return ({
        isOpen: state.openModal === "logoutModal",
    });
}

export default connect(
    mapStateToProps,
    { toggleModal, logoutUser },
)(Logout);
