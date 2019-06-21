import Dialog from "@material-ui/core/Dialog";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { IState } from "../../reducers/index";

import TripDetailsModal from "./TripDetailsModal";

interface ITripDetailsInfoPageProps extends ITripDetailsAnyPageStateProps {
    toggleModal: (modal?: string) => void;
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
                    aria-labelledby="example dialog"
                    open={this.props.isOpen}
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
)(TripDetailsAnyPage);
