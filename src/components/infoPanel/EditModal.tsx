import Dialog from "@material-ui/core/Dialog";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { deleteGuide, updateGuide } from "../../actions/updateGuide";
import { IState } from "../../reducers/index";
import { IInfoPage, IListEntry } from "../../utils/types";
import EditGuide, { IEditGuideState } from "./EditGuide";

interface IEditModalProps extends IEditModalStateProps {
    toggleModal: (modal?: string) => void;
    updateGuide: (item: IEditGuideState, selectedGuide: IListEntry, listEntries: IListEntry[]) => void;
    deleteGuide: (selectedGuideId: string, listEntries: IListEntry[]) => void;
}

interface IEditModalStateProps {
    isOpen: boolean;
    infoPage: IInfoPage;
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
        const selectedGuide: IListEntry = {
            ...this.props.infoPage.selectedGuide,
            display_name: result.displayName,
            river_name: result.riverName,
            region: result.region,
            gauge_id: result.gaugeId,
            position: result.locationMarker ? {
                lat: result.locationMarker.lat,
                lon: result.locationMarker.lng,
            } : this.props.infoPage.selectedGuide.position,
            activity: result.activity ? result.activity : this.props.infoPage.selectedGuide.activity,
        };
        this.props.updateGuide(result, selectedGuide, this.props.listEntries);
        this.closeModal();
    }

    public handleDelete = (): void => {
        this.props.deleteGuide(this.props.infoPage.selectedGuide.id, this.props.listEntries);
        this.closeModal();
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
                    infoPage = {this.props.infoPage}
                    handleSave = {this.handleSave}
                    handleDelete = {this.handleDelete}
                />
            </Dialog>
        );
    }
}

function mapStateToProps(state: IState): IEditModalStateProps {
    return ({
        isOpen: state.openModal === "editModal",
        infoPage: state.infoPage,
        listEntries: state.listEntries,
    });
}

export default connect(
    mapStateToProps,
    { toggleModal, updateGuide, deleteGuide },
)(EditModal);
