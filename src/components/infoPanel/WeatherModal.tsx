import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import React, { Component } from "react";
import { connect } from "react-redux";
import { editLogEntry, toggleModal } from "../../actions/actions";
import { IState } from "../../reducers/index";
import DialogTitle from "../../utils/dialogTitle";
import { IInfoPage, IListEntry, ILogEntry, IOpenLog } from "../../utils/types";
import { WeatherForecast } from "./WeatherForecast";
import { WeatherStore } from "./WeatherStore";

interface IWeatherModalProps extends IWeatherStateProps {
    toggleModal: (modal?: string) => void;
    editLogEntry: (entry: ILogEntry) => void;
    fullScreen: boolean;
}

interface IWeatherStateProps {
    isOpen: boolean;
    openLog: IOpenLog;
    infoPage: IInfoPage;
    weatherStore: WeatherStore;
}

class WeatherModal extends Component<IWeatherModalProps> {
    constructor(props: IWeatherModalProps) {
        super(props);
        this.state = {};
    }

    public closeModal(): void {
        this.props.toggleModal();
    }

    public handleChange(e: any): void {
        this.setState({ [e.target.name]: e.target.value });
    }

    public render(): JSX.Element {
        const entry: IListEntry = this.props.infoPage.selectedGuide;
        return (
            <Dialog
                onClose={(): void => this.props.toggleModal()}
                open={this.props.isOpen}
                fullScreen={this.props.fullScreen}
                fullWidth={true}
                maxWidth={"sm"}
            >
                <DialogTitle handleClose={(): void => this.props.toggleModal()} title={"Weather"}/>
                <DialogContent>
                    {entry && <WeatherForecast
                            lat={entry.position.lat || 0}
                            lon={entry.position.lon || 0}
                            weatherStore={this.props.weatherStore}
                    />}
                </DialogContent>
            </Dialog>
        );
    }
}

function mapStateToProps(state: IState): IWeatherStateProps {
    return ({
        isOpen: state.openModal === "weatherModal",
        openLog: state.openLog,
        infoPage: state.infoPage,
        weatherStore: state.weatherStore,
    });
}

export default connect(
    mapStateToProps,
    { editLogEntry, toggleModal },
)(withMobileDialog()(WeatherModal));
