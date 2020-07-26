import { createStyles, Theme, withStyles } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import React, { Component } from "react";
import { connect } from "react-redux";
import uuid from "uuidv4";
import { toggleModal } from "../../actions/actions";
import { addGuide } from "../../actions/updateGuide";
import { IState } from "../../reducers/index";
import { IAuth, IListEntry, IUser } from "../../utils/types";
import DraftGuide, { IDraftGuideState } from "../draftGuide/DraftGuide";

const styles: any = (theme: Theme): any => createStyles({
    dialogPaper: {
        minHeight: "80vh",
        maxHeight: "80vh",
    },
});

interface IEditModalProps extends IAddModalStateProps {
    toggleModal: (modal?: string) => void;
    addGuide: (
        item: IDraftGuideState,
        selectedGuide: IListEntry,
        listEntries: IListEntry[],
        userRole: IUser,
        userEmail: string,
    ) => void;
    classes: any;
}

interface IAddModalStateProps {
    isOpen: boolean;
    listEntries: IListEntry[];
    auth: IAuth;
}

interface IAddModalState {
    errorOpen: boolean;
    thanksOpen: boolean;
}

class AddModal extends Component<IEditModalProps, IAddModalState> {
    constructor(props: IEditModalProps) {
        super(props);
        this.state = {
            errorOpen: false,
            thanksOpen: false,
        };
    }
    public handleClose = (): void => {
        this.props.toggleModal();
    }

    public closeModal(): void {
        this.setState({thanksOpen: false});
        this.props.toggleModal();
    }

    public handleSave = (result: IDraftGuideState): void => {
        if (result.locationMarker && result.activity) {
            const selectedGuide: IListEntry = {
                id: uuid(),
                display_name: result.displayName,
                river_name: result.riverName,
                region: result.region,
                gauge_id: result.gaugeId,
                position: {
                    lat: result.locationMarker.lat,
                    lon: result.locationMarker.lng,
                },
                activity: result.activity,
            };
            this.props.addGuide(result, selectedGuide, this.props.listEntries, this.props.auth.user, result.userEmail);
        }
    }

    public render(): JSX.Element {
        const { classes } = this.props;
        return (
            <Dialog
                onClose={(): void => this.props.toggleModal()}
                aria-labelledby="example dialog"
                open={this.props.isOpen}
                fullWidth={true}
                fullScreen={false}
                maxWidth={"md"}
                classes={{ paper: classes.dialogPaper }}
            >
                <DraftGuide
                    handleClose = {(): void => this.props.toggleModal()}
                    handleSave = {this.handleSave}
                    title={"Edit guide"}
                />
            </Dialog>
        );
    }
}

function mapStateToProps(state: IState): IAddModalStateProps {
    return ({
        isOpen: state.openModal === "addGuideModal",
        listEntries: state.listEntries,
        auth: state.auth,
    });
}

export default connect(
    mapStateToProps,
    { toggleModal, addGuide },
)(withStyles(styles)(AddModal));
