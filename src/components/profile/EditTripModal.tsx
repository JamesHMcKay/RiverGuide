import PropTypes from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { editLogEntry, toggleModal } from "../../actions/actions";
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

interface IEditTripModalProps {
    isOpen: boolean;
    toggleModal: (modal: string) => void;
    editLogEntry: (entry: ILogEntry) => void;
}

interface IEditTripModalState {
    logEntry?: ILogEntry;
}

class EditTripModal extends Component<IEditTripModalProps, IEditTripModalState> {
    constructor(props: IEditTripModalProps) {
        super(props);
        this.state = {};
        this.closeModal = this.closeModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    public closeModal() {
        this.props.toggleModal("editTrip");
    }

    public handleChange(e: any) {
        this.setState({ [e.target.name]: e.target.value });
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
        this.props.editLogEntry(this.state as ILogEntry);
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
                        Update Entry
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
                            Update
                        </Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

EditTripModal.propTypes = {
    toggleModal: PropTypes.func.isRequired,
    editLogEntry: PropTypes.func.isRequired,
};

const mapStateToProps = (state: IState) => ({
    isOpen: state.openModal === "editTrip",
    openLog: state.openLog,
});

export default connect(
    mapStateToProps,
    { editLogEntry, toggleModal },
)(EditTripModal);
