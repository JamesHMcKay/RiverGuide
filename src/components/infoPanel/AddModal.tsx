import { Button, DialogActions, DialogContentText } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import React, { Component } from "react";
import { connect } from "react-redux";
import uuid from "uuidv4";
import { toggleModal } from "../../actions/actions";
import { addGuide } from "../../actions/updateGuide";
import { IState } from "../../reducers/index";
import { IAuth, IListEntry } from "../../utils/types";
import EditGuide, { IEditGuideState } from "./EditGuide";

interface IEditModalProps extends IAddModalStateProps {
    toggleModal: (modal?: string) => void;
    addGuide: (item: IEditGuideState, selectedGuide: IListEntry, listEntries: IListEntry[], userRole: string) => void;
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

    public handleSave = (result: IEditGuideState): void => {
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
            const userRole: string = this.props.auth.user.role;
            this.props.addGuide(result, selectedGuide, this.props.listEntries, userRole);
            this.setState({
                thanksOpen: true,
            });
        } else {
            this.setState({
                errorOpen: true,
            });
        }
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
                    handleSave = {this.handleSave}
                />
                    <Dialog
                        onClose={(): void => this.setState({errorOpen: false})}
                        open={this.state.errorOpen}
                    >
                        <DialogContentText
                            color="textPrimary"
                            style={{width: "90%", margin: "auto", padding: "40px"}}
                        >
                            {"The guide must have a location and an activity specified."}
                            {"Add a location by clicking anywhere on the map."}
                            {"Choose an activity from the drop down selector."}
                        </DialogContentText>
                        <DialogActions>
                        <Button
                                style={{width: "90%", margin: "auto"}}
                                variant="outlined"
                                onClick={(): void => {this.setState({errorOpen: false}); }}
                            >
                                Okay
                        </Button>
                        </DialogActions>
                    </Dialog>
                    <Dialog
                        onClose={(): void => this.closeModal()}
                        open={this.state.thanksOpen}
                    >
                        <DialogContentText
                            color="textPrimary"
                            style={{width: "90%", margin: "auto", padding: "40px"}}
                        >
                            {"Thanks for submitting a guide, we will review it and get it up as soon as possible."}
                        </DialogContentText>
                        <DialogActions>
                        <Button
                                style={{width: "90%", margin: "auto"}}
                                variant="outlined"
                                onClick={(): void => {this.closeModal(); }}
                            >
                                Okay
                        </Button>
                        </DialogActions>
                    </Dialog>
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
)(AddModal);
