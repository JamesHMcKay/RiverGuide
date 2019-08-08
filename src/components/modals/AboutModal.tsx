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
                        <p>The purpose of <strong> RiverGuide </strong>
                            is to provide the largest database of freshwater
                            recreation sites in New Zealand, while also generating
                            important insights that ensure they are conserved and improved forever.</p>
                        <p>We aim to provide all freshwater users with the best tools to discover, plan, record
                            and share their experiences, while being provided with up-to-date
                            environmental conditions for planning a safe and enjoyable trip.</p>
                    </DialogContentText>
                   </DialogContent>
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
