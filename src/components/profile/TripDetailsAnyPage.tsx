import Dialog from "@material-ui/core/Dialog";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { IState } from "../../reducers/index";

import withMobileDialog from "@material-ui/core/withMobileDialog";
import TripDetailsModal from "./TripDetailsModal";

interface ITripDetailsInfoPageProps extends ITripDetailsAnyPageStateProps {
    toggleModal: (modal?: string) => void;
    fullScreen: boolean;
}

interface ITripDetailsAnyPageStateProps {
    isOpen: boolean;
}

class TripDetailsAnyPage extends Component<ITripDetailsInfoPageProps> {
    public closeModal(): void {
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
                    <TripDetailsModal
                        handleClose = {(): void => this.props.toggleModal()}
                    />
                </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state: IState): ITripDetailsAnyPageStateProps {
    return ({
        isOpen: state.openModal === "addTripAnyPage",
    });
}

export default connect(
    mapStateToProps,
    { toggleModal},
)(withMobileDialog()(TripDetailsAnyPage));
