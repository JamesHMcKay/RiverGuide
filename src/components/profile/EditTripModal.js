import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { editLogEntry, toggleModal } from "../../actions/actions";

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

class EditTripModal extends Component {
    constructor() {
        super();
        this.state = {};

        this.closeModal = this.closeModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
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
        this.props.editLogEntry(this.state);
    }

    render() {
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
    editLogEntry: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    isOpen: state.openModal === "editTrip",
    openLog: state.openLog
});

export default connect(
    mapStateToProps,
    { editLogEntry, toggleModal }
)(EditTripModal);
