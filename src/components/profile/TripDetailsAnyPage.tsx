import Dialog from "@material-ui/core/Dialog";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { IState } from "../../reducers/index";
import TripDetailsModal from "./TripDetailsModal";

import { createStyles, Theme } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles: any = (theme: Theme): any => createStyles({
    dialogPaper: {
        minHeight: "80vh",
        maxHeight: "95vh",
    },
});

interface ITripDetailsInfoPageProps extends ITripDetailsAnyPageStateProps {
    toggleModal: (modal?: string) => void;
    fullScreen: boolean;
    classes: any;
}

interface ITripDetailsAnyPageStateProps {
    isOpen: boolean;
}

class TripDetailsAnyPage extends Component<ITripDetailsInfoPageProps> {
    public closeModal(): void {
        this.props.toggleModal();
    }

    public render(): JSX.Element {
        const { classes } = this.props;
        return (
            <div>
                <Dialog
                    onClose={(): void => this.props.toggleModal()}
                    open={this.props.isOpen}
                    fullScreen={this.props.fullScreen}
                    fullWidth={true}
                    maxWidth={"sm"}
                    classes={{ paper: classes.dialogPaper }}
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
)(withMobileDialog()(withStyles(styles)(TripDetailsAnyPage)));
