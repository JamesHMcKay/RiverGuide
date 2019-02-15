import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { createLogEntry, toggleModal } from "../../actions/actions";
import { State } from "../../reducers/index";
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

const FORM_CONTENT = [
    { name: "date", type: "date", label: "Date of Trip" },
    {
        name: "participantCount",
        type: "number",
        label: "Number of Participants",
    },
    { name: "rating", type: "number", label: "Rating (0 - 5)" },
    { name: "description", type: "textarea", label: "Description" },
];

const initialState = {
    _id: "",
    section: "Lower Taieri",
    date: "",
    participantCount: 1,
    rating: 3,
    description: "",
};

interface ITripDetailsModelProps {
    isOpen: boolean;
    toggleModal: (modal: string) => void;
    createLogEntry: (item: ILogEntry) => void;
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

    public closeModal() {
        this.props.toggleModal("addTrip");
    }

    public handleChange(e: any) {
        const key = e.target.name;
        if (this.state.logEntry && key in Object.keys(this.state.logEntry)) {
            const logEntry = this.state.logEntry;
            logEntry[key as keyof ILogEntry] = e.target.value;
            this.setState({ logEntry });
        }
    }

    public handleSectionChange(e: any) {
        if (this.state.logEntry) {
            let logEntry = this.state.logEntry;
            logEntry = {
                ...logEntry,
                section: e.value,
            };
            this.setState({ logEntry });
        }
    }

    public handleSave() {
        this.props.createLogEntry(this.state.logEntry as ILogEntry);
    }

    public getValue = (key: string): string => {
        if (this.state.logEntry && key in Object.keys(this.state.logEntry)) {
            return this.state.logEntry[key as keyof ILogEntry] as string;
        } else {
            return "";
        }
    }

    public render() {
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
                            {FORM_CONTENT.map((field, idx) => (
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

TripDetailsModal.propTypes = {
    toggleModal: PropTypes.func.isRequired,
    createLogEntry: PropTypes.func.isRequired,
};

const mapStateToProps = (state: State) => ({
    isOpen: state.openModal === "addTrip",
});

export default connect(
    mapStateToProps,
    { createLogEntry, toggleModal },
)(TripDetailsModal);
