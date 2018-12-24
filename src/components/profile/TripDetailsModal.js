import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { createLogEntry, toggleModal } from "../../actions/actions";

import SectionSelect from "./SectionSelect";

import {
    Button,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Form,
    FormGroup,
    Label,
    Input
} from "reactstrap";

const FORM_CONTENT = [
    { name: "date", type: "date", label: "Date of Trip" },
    {
        name: "participantCount",
        type: "number",
        label: "Number of Participants"
    },
    { name: "rating", type: "number", label: "Rating (0 - 5)" },
    { name: "description", type: "textarea", label: "Description" }
];

const initialState = {
    section: "Lower Taieri",
    date: "",
    participantCount: 1,
    rating: 3,
    description: ""
};

class TripDetailsModal extends Component {
    constructor() {
        super();
        this.state = initialState;

        this.closeModal = this.closeModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSectionChange = this.handleSectionChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    closeModal() {
        this.props.toggleModal();
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleSectionChange(e) {
        this.setState({ section: e.value });
    }

    handleSave() {
        this.props.createLogEntry(this.state);
    }

    render() {
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
                                        type={field.type}
                                        name={field.name}
                                        onChange={this.handleChange}
                                        value={this.state[field.name]}
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
    createLogEntry: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    isOpen: state.openModal === "addTrip"
});

export default connect(
    mapStateToProps,
    { createLogEntry, toggleModal }
)(TripDetailsModal);
