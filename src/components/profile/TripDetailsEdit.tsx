import Dialog from "@material-ui/core/Dialog";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { IState } from "../../reducers/index";
import { IListEntry, ILogComplete } from "../../utils/types";

import TripDetailsModal from "./TripDetailsModal";

interface ITripDetailsEditProps extends ITripDetailsEditStateProps {
    toggleModal: (modal?: string) => void;
}

interface ITripDetailsEditStateProps {
    isOpen: boolean;
    selectedLogId: string;
    log: ILogComplete[];
    listEntries: IListEntry[];
}

class TripDetailsEdit extends Component<ITripDetailsEditProps> {

    public handleClose = (): void => {
        this.props.toggleModal();
    }

    public closeModal(): void {
        this.props.toggleModal();
    }

    public getLogEntry(): ILogComplete | undefined {
        if (this.props.selectedLogId !== null) {
            const selectedLog: ILogComplete[] = this.props.log.filter(
                (item: ILogComplete) => item.log_id === this.props.selectedLogId,
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
        return (
            <div>
                <Dialog onClose={this.closeModal} aria-labelledby="example dialog" open={this.props.isOpen}>
                    <TripDetailsModal
                        handleClose = {this.handleClose}
                        initialLogEntry = {this.getLogEntry()}
                        selectedGuide = {logEntry ? this.getSelectedGuide(logEntry.guide_id) : undefined}
                        isUpdate = {true}
                    />
                </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state: IState): ITripDetailsEditStateProps {
    return ({
        isOpen: state.openModal === "editTripDetails",
        selectedLogId: state.selectedLogId,
        log: state.filteredLogList,
        listEntries: state.listEntries,
    });
}

export default connect(
    mapStateToProps,
    { toggleModal},
)(TripDetailsEdit);
