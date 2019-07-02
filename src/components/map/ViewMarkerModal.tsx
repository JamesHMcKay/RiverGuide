import { DialogContentText, IconButton } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import React, { Component } from "react";
import { IMarker } from "../../utils/types";

interface IViewMarkerModalProps {
    handleClose: () => void;
    marker: IMarker;
    isOpen: boolean;
}

export default class ViewMarkerModal extends Component<IViewMarkerModalProps> {
    public render(): JSX.Element {
        return (
            <Dialog
                onClose={(): void => this.props.handleClose()}
                open={this.props.isOpen}
                fullWidth={true}
                maxWidth={"sm"}
            >
            <DialogTitle>
                        <IconButton
                            aria-label="Close"
                            style={{position: "absolute", right: 0, top: 0}}
                            onClick={this.props.handleClose}
                        >
                            <CloseIcon />
                        </IconButton>
                            {this.props.marker.name}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                        {this.props.marker.category}
                        </DialogContentText>
                        <br />
                        <DialogContentText>
                        {this.props.marker.description}
                        </DialogContentText>
                    </DialogContent>
            </Dialog>
        );
    }
}
