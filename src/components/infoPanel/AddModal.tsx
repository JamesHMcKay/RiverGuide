import Dialog from "@material-ui/core/Dialog";
import React, { Component } from "react";
import { connect } from "react-redux";
import uuid from "uuidv4";
import { toggleModal } from "../../actions/actions";
import { addGuide } from "../../actions/updateGuide";
import { IState } from "../../reducers/index";
import { IListEntry } from "../../utils/types";
import EditGuide, { IEditGuideState } from "./EditGuide";

interface IEditModalProps extends IAddModalStateProps {
    toggleModal: (modal?: string) => void;
    addGuide: (item: IEditGuideState, selectedGuide: IListEntry, listEntries: IListEntry[]) => void;
}

interface IAddModalStateProps {
    isOpen: boolean;
    listEntries: IListEntry[];
}

class EditModal extends Component<IEditModalProps> {
    public handleClose = (): void => {
        this.props.toggleModal();
    }

    public closeModal(): void {
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
            this.props.addGuide(result, selectedGuide, this.props.listEntries);
            this.closeModal();
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
            </Dialog>
        );
    }
}

function mapStateToProps(state: IState): IAddModalStateProps {
    return ({
        isOpen: state.openModal === "addGuideModal",
        listEntries: state.listEntries,
    });
}

export default connect(
    mapStateToProps,
    { toggleModal, addGuide },
)(EditModal);
