import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { IState } from "../../reducers";
import DialogTitle from "../../utils/dialogTitle";

interface IAboutModalProps extends IAboutModalPropsStateProps {
    toggleModal: (modal?: string) => void;
    fullScreen: boolean;
}

interface IAboutModalPropsStateProps {
    isOpen: boolean;
}

class AboutModal extends Component<IAboutModalProps> {
    public handleClose = (): void => {
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
                <DialogTitle handleClose={this.handleClose} title={"Data for good"}/>
                <DialogContent>
                    <DialogContentText>
                        <p>The vision of <strong> RiverGuide </strong>
                            is to generate the largest database of freshwater
                            recreation sites in New Zealand, while also generating
                            important data and insights that ensure they are conserved and improved forever.</p>
                        <p>We aim to provide outdoor enthusiasts with the best tools to discover, plan, record
                            and share their freshwater experiences, while being provided with the most up-to-date
                            environmental conditions that will help them to plan a safe and enjoyable trip.</p>
                        <p>The <strong>RiverGuide</strong> database will be kept up-to-date by users just
                        like yourself, so it is forever growing. Descriptions and rich content will be updated by
                        engaged users with the latest information.</p>
                        <p>Don't see your favourite activity on the site, or want to update one that is already
                            there? Go ahead, sign up and get started!</p>
                    </DialogContentText>
                   </DialogContent>
                    <Button
                        variant = "contained"
                        color="primary"
                        onClick={this.handleClose}
                        fullWidth>
                                Close
                    </Button>
                </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state: IState): IAboutModalPropsStateProps {
    return ({
        isOpen: state.openModal === "aboutModal",
    });
}

export default connect(
    mapStateToProps,
    { toggleModal},
)(withMobileDialog()(AboutModal));
