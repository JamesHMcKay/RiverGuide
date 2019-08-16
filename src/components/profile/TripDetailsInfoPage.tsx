import Dialog from "@material-ui/core/Dialog";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { IState } from "../../reducers/index";
import { IInfoPage } from "../../utils/types";
import TripDetailsModal from "./TripDetailsModal";

import { createStyles, Theme } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles: any = (theme: Theme): any => createStyles({
    dialogPaper: {
        minHeight: '80vh',
        maxHeight: '95vh',
    },
});

interface ITripDetailsInfoPageProps extends ITripDetailsInfoPageStateProps {
    toggleModal: (modal?: string) => void;
    fullScreen: boolean;
    classes: any;
}

interface ITripDetailsInfoPageStateProps {
    isOpen: boolean;
    infoPage: IInfoPage;
}

class TripDetailsInfoPage extends Component<ITripDetailsInfoPageProps> {
    public handleClose = (): void => {
        this.props.toggleModal();
    }

    public closeModal(): void {
        this.props.toggleModal();
    }

    public render(): JSX.Element {
        const { classes } = this.props;
        return (
            <div>
                <Dialog
                    onClose={this.closeModal}
                    open={this.props.isOpen}
                    fullScreen={this.props.fullScreen}
                    fullWidth={true}
                    maxWidth={"sm"}
                    classes={{ paper: classes.dialogPaper }}
                >
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
)(withMobileDialog()(withStyles(styles)(TripDetailsInfoPage)));
