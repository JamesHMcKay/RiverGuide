import { Typography } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { IState } from "../../reducers/index";
import DialogTitle from "../../utils/dialogTitle";
import { IInfoPage, IListEntry, ILogComplete } from "../../utils/types";

interface IViewLogItem {
    key: keyof ILogComplete;
    title: string;
}

const _MS_PER_HOUR: number = 1000 * 60 * 60;

const SHOW_ITEMS: IViewLogItem[] = [
    {key: "guide_name", title: "Section"},
    {key: "river_name", title: "River"},
    {key: "description", title: "Description"},
    // {key: "start_date_time", title: "Date"},
    {key: "participants", title: "Participants"},
    {key: "flow", title: "Flow"},
    {key: "rating", title: "Rating"},
];

interface ITripDetailsViewProps extends ITripDetailsViewStateProps {
    toggleModal: (modal?: string) => void;
    fullScreen: boolean;
}

interface ITripDetailsViewStateProps {
    isOpen: boolean;
    selectedLogId: string[];
    log: ILogComplete[];
    listEntries: IListEntry[];
    infoPage: IInfoPage;
}

function dateConvert(inputDate: string): string {
    const dateParsed: Date = new Date(inputDate);
    return dateParsed.toDateString();
}

function computeDuration(logEntry: ILogComplete): string {
    const startDate: Date = new Date(logEntry.start_date_time);
    const endDate: Date = new Date(logEntry.end_date_time);

    const duration: number = (endDate.getTime() - startDate.getTime()) / _MS_PER_HOUR;
    return duration.toFixed(1) + " hours";
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
        let titleTime: string = "";
        if (logEntry) {
            titleTime = dateConvert(logEntry.start_date_time);
        }
        const title: string = logEntry ? titleTime : "Invalid log entry";
        return (
            <Dialog
                onClose={this.closeModal}
                open={this.props.isOpen}
                fullScreen={false}
                fullWidth={true}
                maxWidth={"sm"}
            >
            <DialogTitle handleClose={this.handleClose} title={title}/>
                <DialogContent>
                    {SHOW_ITEMS.map((item: IViewLogItem) => (
                        <div key={item.key}>
                            <Typography variant="body1">
                                {item.title}
                            </Typography>
                            <DialogContentText align = "center">
                                {logEntry ? logEntry[item.key] : ""}
                            </DialogContentText>
                        </div>
                    ))
                    }
                        <div>
                            <Typography variant="body1">
                                {"Duration"}
                            </Typography>
                            <DialogContentText align = "center">
                                {logEntry ? computeDuration(logEntry) : ""}
                            </DialogContentText>
                        </div>
                   </DialogContent>
            </Dialog>
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
)(withMobileDialog()(TripDetailsView));
