import { Button, DialogActions, IconButton, MenuItem, TextField } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import React, { Component } from "react";

const categoryList: string[] = ["Put In", "Take out", "Carpark", "Track",
    "Rapid", "Play", "Feature", "Waterfall", "Hazard", "Portage"].sort();

interface IMarkerModalProps {
    handleClose: () => void;
    handleChange: (name: any) => (({ target: {value}}: any) => void);
    description: string;
    category: string;
    isOpen: boolean;
    name: string;
    deleteMode: boolean;
    handleSave: () => void;
    handleDelete: () => void;
}

export default class MarkerModal extends Component<IMarkerModalProps> {
    public render(): JSX.Element {
        return (
            <div>
                <Dialog
                    onClose={(): void => this.props.handleClose()}
                    open={this.props.isOpen}
                    fullWidth={true}
                    maxWidth={"sm"}
                >
                <DialogTitle >
                            <IconButton
                                aria-label="Close"
                                style={{position: "absolute", right: 0, top: 0}}
                                onClick={this.props.handleClose}
                            >
                                <CloseIcon />
                            </IconButton>
                            Please provide marker details
                        </DialogTitle>
                        <DialogContent>
                            <TextField
                                fullWidth
                                label="Name*"
                                variant="outlined"
                                margin="dense"
                                value={this.props.name}
                                onChange={this.props.handleChange("name")}
                                autoFocus
                            />
                            <br />
                            <TextField
                                select
                                label="Category*"
                                value={this.props.category}
                                onChange={this.props.handleChange("category")}
                                fullWidth
                                margin="dense"
                                variant="outlined"
                            >
                                {categoryList.map((category: string) =>
                                    <MenuItem key={category} value={category}>{category}</MenuItem>,
                                )}
                            </TextField>
                            <TextField
                                label="Description"
                                multiline
                                rows="4"
                                margin="dense"
                                variant="outlined"
                                fullWidth
                                value={this.props.description}
                                onChange={this.props.handleChange("description")}
                            />
                        </DialogContent>
                        <DialogActions>
                            <Button
                                disabled={!this.props.name || !this.props.category }
                                onClick={this.props.handleSave}
                                color="secondary"
                            >
                                Save
                            </Button>
                            {this.props.deleteMode ?
                                <Button onClick={this.props.handleDelete} style={{color: "red"}}>
                                    Delete
                                </Button> :
                                <Button onClick={this.props.handleClose} color="primary">
                                    Cancel
                                </Button>
                            }
                        </DialogActions>
                </Dialog>
            </div>
        );
    }
}
