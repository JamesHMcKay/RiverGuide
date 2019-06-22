import Dialog from "@material-ui/core/Dialog";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { IState } from "../../reducers/index";
import { IInfoPage, IListEntry, ILogComplete } from "../../utils/types";

import Button from "@material-ui/core/Button";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "../../utils/dialogTitle";

interface ITripDetailsViewProps extends ITripDetailsViewStateProps {
    toggleModal: (modal?: string) => void;
}

interface ITripDetailsViewStateProps {
    isOpen: boolean;
    selectedLogId: string[];
    log: ILogComplete[];
    listEntries: IListEntry[];
    infoPage: IInfoPage;
}

class TripDetailsView extends Component<ITripDetailsViewProps> {
    public handleClose = (): void => {
        this.props.toggleModal();
    }

    public closeModal(): void {
        this.props.toggleModal();
    }

    public getLogEntry(): ILogComplete | undefined {
        const logs: ILogComplete[] = this.props.log.concat(this.props.infoPage.logs || []);
        if (this.props.selectedLogId !== null) {
            const selectedLog: ILogComplete[] = logs.filter(
                (item: ILogComplete) => item.log_id === this.props.selectedLogId[0],
            );
            return selectedLog[0];
        }
        return undefined;
    }

    public getSelectedGuide = (guideId: string): IListEntry | undefined => {
        const selectedGuide: IListEntry[] = this.props.listEntries.filter(
            (item: IListEntry) => item.id === guideId,
        );
        return selectedGuide[0];
    }

    public render(): JSX.Element {
        const logEntry: ILogComplete | undefined = this.getLogEntry();
        const description: string = logEntry ? logEntry.description : "No description";
        return (
            <div>
            <Dialog onClose={this.closeModal} open={this.props.isOpen}>
            <DialogTitle handleClose={this.handleClose} title={"View log entry"}/>
                <DialogContent>
                    <DialogContentText>
                    {description}
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

function mapStateToProps(state: IState): ITripDetailsViewStateProps {
    return ({
        isOpen: state.openModal === "viewTripDetails",
        selectedLogId: state.selectedLogId,
        log: state.log,
        infoPage: state.infoPage,
        listEntries: state.listEntries,
    });
}

export default connect(
    mapStateToProps,
    { toggleModal},
)(TripDetailsView);
