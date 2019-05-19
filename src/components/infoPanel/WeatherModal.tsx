import React, { Component } from "react";
import { connect } from "react-redux";
import { editLogEntry, toggleModal } from "../../actions/actions";
import { IState } from "../../reducers/index";
import { IInfoPage, IListEntry, ILogEntry, IOpenLog } from "../../utils/types";
import { WeatherForecast } from "./WeatherForecast";
import { WeatherStore } from "./WeatherStore";

import {
    Button,
    Form,
    FormGroup,
    Input,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
} from "reactstrap";

interface IWeatherModalProps extends IWeatherStateProps {
    toggleModal: (modal?: string) => void;
    editLogEntry: (entry: ILogEntry) => void;
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
                <Modal isOpen={this.props.isOpen} toggle={(): void => this.props.toggleModal()}>
                    <ModalHeader toggle={(): void => this.props.toggleModal()}>
                        Weather
                    </ModalHeader>
                    <ModalBody>
                    {entry && <WeatherForecast
                            lat={entry.position.lat || 0}
                            lon={entry.position.lon || 0}
                            weatherStore={this.props.weatherStore}
                        />}
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={(): void => this.props.toggleModal()}>Close</Button>
                    </ModalFooter>
                </Modal>
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
)(WeatherModal);
