import { Button, Dialog, DialogActions, DialogTitle, IconButton, Tooltip, Typography } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import React, { Component } from "react";
import { CSVLink } from "react-csv";
import { connect } from "react-redux";
import { deleteLogEntry, toggleModal } from "../../actions/actions";
import { IState } from "../../reducers";
import { ILogComplete, IObsValue } from "../../utils/types";

interface ILogbookHeadProps extends ILogbookHeadStateProps {
    deleteLogEntry: (logId: string) => void;
    toggleModal: (modal?: string) => void;
}

interface ILogbookHeadStateProps {
    log: ILogComplete[];
    selectedLogIds: string[];
}

interface ILogbookHeadState {
    confirmDeleteDialogOpen: boolean;
}

interface ILogDownloadItem {
    guideName: string;
    rating: number;
    participants: number;
    startDateTime: string;
    endDateTime: string;
}

class LogbookHead extends Component<ILogbookHeadProps, ILogbookHeadState> {
    constructor(props: ILogbookHeadProps) {
        super(props);
        this.state = {
            confirmDeleteDialogOpen: false,
        };
    }

    public deleteLogs = (): void => {
        for (const logId of this.props.selectedLogIds) {
            this.props.deleteLogEntry(logId);
        }
        this.handleClose();
    }

    public editLog = (): void => {
        this.props.toggleModal("editTripDetails");
    }

    public handleClose = (): void => {
        this.setState({
            confirmDeleteDialogOpen: false,
        });
    }

    public getData = (numSelected: number): Array<ILogDownloadItem | Partial<IObsValue>> => {
        const filteredLogs: ILogComplete[] = numSelected > 0 ?
            this.props.log.filter((item: ILogComplete) => this.props.selectedLogIds.indexOf(item.id) > -1) :
            this.props.log;
        const output: Array<ILogDownloadItem | Partial<IObsValue>> = filteredLogs.map((item: ILogComplete) => ({
            guideName: item.guide_name,
            rating: item.rating,
            participants: item.participants,
            startDateTime: item.start_date_time,
            endDateTime: item.end_date_time,
            ...item.observables,
        }));
        return output;
    }

    public getDownloadButton = (numSelected: number): JSX.Element => {
        const buttonText: string = numSelected > 0 ? "Download selection" : "Download log entries";
        return (
            <Button
                style={{
                    marginLeft: "auto",
                    height: "fit-content",
                    marginTop: "10px",
                    marginRight: "10px",
                    textTransform: "none",
                }}
                variant="outlined"
                size="small"
            >
            <CSVLink data={this.getData(numSelected)}>
                {buttonText}
            </CSVLink>
        </Button>
        );
    }

    public render(): JSX.Element {
        const numSelected: number = this.props.selectedLogIds.length;
        return (
            <div style={{minHeight: "50px", display: "flex", flexDirection: "row"}}>
                <Tooltip title="Delete">
                    <IconButton
                        aria-label="Delete"
                        onClick={(): void => {this.setState({confirmDeleteDialogOpen: true}); }}
                        disabled={numSelected < 1}
                    >
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Edit">
                    <IconButton
                        aria-label="Edit"
                        onClick={this.editLog}
                        disabled={numSelected !== 1}
                    >
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                {numSelected > 0 &&
                    <Typography style={{margin: "auto"}} color="inherit" variant="h6">
                        {numSelected} selected
                    </Typography>
                }
                {this.getDownloadButton(numSelected)}
                <Dialog
                    open={this.state.confirmDeleteDialogOpen}
                    onClose={this.handleClose}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">{`Delete ${numSelected} log book entries?`}</DialogTitle>
                    <DialogActions>
                    <Button onClick={this.handleClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={this.deleteLogs} color="primary" autoFocus>
                        Okay
                    </Button>
                    </DialogActions>
                 </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state: IState): ILogbookHeadStateProps {
    return ({
        log: state.filteredLogList,
        selectedLogIds: state.selectedLogId,
    });
}

export default connect(
    mapStateToProps,
    { deleteLogEntry, toggleModal },
)(LogbookHead);
