import Dialog from "@material-ui/core/Dialog";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { IState } from "../../reducers/index";
import { IInfoPage } from "../../utils/types";

import TripDetailsModal from "./TripDetailsModal";

interface ITripDetailsInfoPageProps extends ITripDetailsInfoPageStateProps {
    toggleModal: (modal?: string) => void;
}

interface ITripDetailsInfoPageStateProps {
    isOpen: boolean;
    infoPage: IInfoPage;
}

class TripDetailsInfoPage extends Component<ITripDetailsInfoPageProps> {
    constructor(props: ITripDetailsInfoPageProps) {
        super(props);
    }

    public handleClose = (): void => {
        this.props.toggleModal();
    }

    public closeModal(): void {
        this.props.toggleModal();
    }

    public render(): JSX.Element {
        return (
            <div>
                <Dialog onClose={this.closeModal} aria-labelledby="example dialog" open={this.props.isOpen}>
                    <TripDetailsModal
                        handleClose = {this.handleClose}
                        selectedGuide = {this.props.infoPage.selectedGuide}
                        gaugeHistory = {this.props.infoPage.history}
                    />

                </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state: IState): ITripDetailsInfoPageStateProps {
    return ({
        isOpen: state.openModal === "addTripInfoPage",
        infoPage: state.infoPage,
    });
}

export default connect(
    mapStateToProps,
    { toggleModal},
)(TripDetailsInfoPage);
