import React, { Component } from "react";
import { connect } from "react-redux";
import { createLogEntry, toggleModal } from "../../actions/actions";
import { IState } from "../../reducers/index";
import { ILogEntry } from "../../utils/types";

import SectionSelect from "./SectionSelect";

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

const FORM_CONTENT: Array<{name: string; type: string; label: string}> = [
    { name: "date", type: "date", label: "Date of Trip" },
    {
        name: "participantCount",
        type: "number",
        label: "Number of Participants",
    },
    { name: "rating", type: "number", label: "Rating (0 - 5)" },
    { name: "description", type: "textarea", label: "Description" },
];

const initialState: ILogEntry = {
    _id: "",
    section: "Lower Taieri",
    date: "",
    participantCount: 1,
    rating: 3,
    description: "",
};

interface ITripDetailsModelProps extends ITripDetailsModelStateProps {
    toggleModal: (modal: string) => void;
    createLogEntry: (item: ILogEntry) => void;
}

interface ITripDetailsModelStateProps {
    isOpen: boolean;
}

interface ITripDetailsModelState {
    logEntry: ILogEntry;
}

class TripDetailsModal extends Component<ITripDetailsModelProps, ITripDetailsModelState> {
    constructor(props: ITripDetailsModelProps) {
        super(props);
        this.state = {
            logEntry: initialState,
        };

        this.closeModal = this.closeModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSectionChange = this.handleSectionChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    public closeModal(): void {
        this.props.toggleModal("addTrip");
    }

    public handleChange(e: any): void {
        const key: string = e.target.name;
        if (this.state.logEntry && key in Object.keys(this.state.logEntry)) {
            const logEntry: ILogEntry = this.state.logEntry;
            logEntry[key as keyof ILogEntry] = e.target.value;
            this.setState({ logEntry });
        }
    }

    public handleSectionChange(e: any): void {
        if (this.state.logEntry) {
            let logEntry: ILogEntry = this.state.logEntry;
            logEntry = {
                ...logEntry,
                section: e.value,
            };
            this.setState({ logEntry });
        }
    }

    public handleSave(): void {
        this.props.createLogEntry(this.state.logEntry as ILogEntry);
    }

    public getValue = (key: string): string => {
        if (this.state.logEntry && key in Object.keys(this.state.logEntry)) {
            return this.state.logEntry[key as keyof ILogEntry] as string;
        } else {
            return "";
        }
    }

    public render(): JSX.Element {
        return (
            <div>
                <Modal isOpen={this.props.isOpen} toggle={this.closeModal}>
                    <ModalHeader toggle={this.closeModal}>
                        Add Trip to Logbook
                    </ModalHeader>
                    <ModalBody>
                        <Form>
                            <SectionSelect
                                handleChange={this.handleSectionChange}
                            />
                            {FORM_CONTENT.map((field: {name: string, label: string}, idx: number) => (
                                <FormGroup key={idx}>
                                    <Label for={field.name}>
                                        {field.label}
                                    </Label>
                                    <Input
                                        type={"text"}
                                        name={field.name}
                                        onChange={this.handleChange}
                                        value={this.getValue(field.name)}
                                    />
                                </FormGroup>
                            ))}
                        </Form>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={this.closeModal}>Cancel</Button>{" "}
                        <Button onClick={this.handleSave} color="primary">
                            Save
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

function mapStateToProps(state: IState): ITripDetailsModelStateProps {
    return ({
        isOpen: state.openModal === "addTrip",
    });
}

export default connect(
    mapStateToProps,
    { createLogEntry, toggleModal },
)(TripDetailsModal);
