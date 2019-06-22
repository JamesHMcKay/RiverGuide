import { Button, Dialog, DialogActions, DialogTitle, IconButton, Tooltip, Typography } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import React, { Component } from "react";
import { connect } from "react-redux";
import { deleteLogEntry, toggleModal } from "../../actions/actions";
import { IState } from "../../reducers";
import { ILogComplete } from "../../utils/types";

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

    // public componentDidUpdate(prevProps: ILogbookHeadProps): void {
    //     const idChange: boolean = this.props.selectedLogIds[0] !== prevProps.selectedLogIds[0];
    //     if (this.props.selectedLogIds.length === 1 && idChange) {
    //         this.props.setSelectedLogId(this.props.selectedLogIds[0]);
    //     }
    // }

    public handleClose = (): void => {
        this.setState({
            confirmDeleteDialogOpen: false,
        });
    }

    public render(): JSX.Element {
        const numSelected: number = this.props.selectedLogIds.length;
        return (
            <div >
                {numSelected > 0 &&
                    <Typography color="inherit" variant="subtitle1">
                    {numSelected} selected
                </Typography>}
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="Delete" onClick={(): void => {this.setState({confirmDeleteDialogOpen: true}); }}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton aria-label="Filter list">
            </IconButton>
          </Tooltip>
        )}
        {numSelected === 1 &&
                  <Tooltip title="Edit">
                  <IconButton aria-label="Edit" onClick={this.editLog}>
                    <EditIcon />
                  </IconButton>
                </Tooltip>
        }
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
