import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { IState } from "../../reducers";
import DialogTitle from "../../utils/dialogTitle";
import { IInfoPage, IMarker } from "../../utils/types";
import InfoMapComponent from "./InfoMapComponent";

interface IMapModalProps extends IMapModalPropsStateProps {
    toggleModal: (modal?: string) => void;
    fullScreen: boolean;
}

interface IMapModalPropsStateProps {
    isOpen: boolean;
    infoPage: IInfoPage;
}

class MapModal extends Component<IMapModalProps> {
    public handleClose = (): void => {
        this.props.toggleModal();
    }

    // public getMap = (): JSX.Element | null => {
    //     const guideId: string | undefined = this.props.infoPage.selectedGuide ? this.props.infoPage.selectedGuide.id : "";
    //     let markerList: IMarker[] | undefined =
    //         this.props.infoPage.itemDetails && this.props.infoPage.itemDetails.markerList;
    //     if (!markerList && this.props.infoPage.itemDetails) {
    //         const marker: IMarker = {
    //             name: "Location",
    //             lat: this.props.infoPage.itemDetails.position.lat,
    //             lng: this.props.infoPage.itemDetails.position.lon || 0,
    //             id: "1",
    //             description: "",
    //             category: "",
    //         };
    //         markerList = [marker];
    //     }
    //     if (markerList && markerList.length > 0) {
    //         return (
    //                 <InfoMapComponent draggable={true} guideId={guideId}/>
    //         );
    //     }
    //     return null;
    // }

    public render(): JSX.Element {
        const guideId: string | undefined = this.props.infoPage.selectedGuide ? this.props.infoPage.selectedGuide.id : "";
        const name: string = this.props.infoPage.selectedGuide ?
            this.props.infoPage.selectedGuide.display_name : "";
        return (
            <div>
                <Dialog
                    onClose={(): void => this.props.toggleModal()}
                    open={this.props.isOpen}
                    fullScreen={this.props.fullScreen}
                    fullWidth={true}
                    maxWidth={"sm"}
                >
                <DialogTitle handleClose={this.handleClose} title={name}/>
                <DialogContent>
                    <InfoMapComponent draggable={true} guideId={guideId} height={"500px"}/>
                   </DialogContent>
                </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state: IState): IMapModalPropsStateProps {
    return ({
        isOpen: state.openModal === "mapModal",
        infoPage: state.infoPage,
    });
}

export default connect(
    mapStateToProps,
    { toggleModal},
)(withMobileDialog()(MapModal));
