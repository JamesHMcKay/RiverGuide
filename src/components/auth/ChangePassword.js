import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import zxcvbn from "zxcvbn";

import { toggleModal, changePassword } from "../../actions/actions";

import {
    Button,
    Form,
    FormGroup,
    Input,
    InputGroup,
    InputGroupAddon,
    Label,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Progress
} from "reactstrap";

class ChangePassword extends Component {
    constructor() {
        super();
        this.state = {
            password: "",
            newPassword: "",
            newPassword2: "",
            passwordScore: 0,
            passwordColor: "",
            showPassword: false,
            showOldPassword: false,
            errors: {}
        };

        this.closeModal = this.closeModal.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.togglePassword = this.togglePassword.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
        this.toggleOldPassword = this.toggleOldPassword.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }
    }

    toggleOldPassword() {
        this.setState({ showOldPassword: !this.state.showOldPassword });
    }

    togglePassword() {
        this.setState({ showPassword: !this.state.showPassword });
    }

    onChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    onPasswordChange(e) {
        var checkPassword = zxcvbn(e.target.value),
            score = checkPassword.score + 1,
            color;

        score = e.target.value === "" ? 0 : score;

        switch (score) {
            case 0:
                color = "danger";
                break;
            case 1:
                color = "danger";
                break;
            case 2:
                color = "warning";
                break;
            case 3:
                color = "success";
                break;
            case 4:
                color = "success";
                score = 5;
                break;
            default:
                color = "success";
        }

        this.setState({
            [e.target.name]: e.target.value,
            passwordScore: score,
            passwordColor: color
        });
    }

    onSubmit(e) {
        e.preventDefault();

        const updateUser = {
            email: this.props.auth.user.email,
            password: this.state.password,
            newPassword: this.state.newPassword,
            newPassword2: this.state.newPassword2
        };

        this.props.changePassword(updateUser, this.props.history);
    }

    closeModal() {
        this.props.toggleModal();
    }

    render() {
        const { errors } = this.state;

        return (
            <Modal isOpen={this.props.isOpen} toggle={this.closeModal}>
                <ModalHeader toggle={this.closeModal}>
                    Pick A New Password
                </ModalHeader>
                <Form onSubmit={this.onSubmit}>
                    <ModalBody>
                        <FormGroup>
                            <Label for="password">Current Password</Label>
                            <InputGroup>
                                <Input
                                    className={classnames("", {
                                        "is-invalid":
                                            errors.data && errors.data.password
                                    })}
                                    type={
                                        this.state.showOldPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    id="password"
                                    value={this.state.password}
                                    onChange={this.onChange}
                                />
                                <InputGroupAddon addonType="append">
                                    <Button onClick={this.toggleOldPassword}>
                                        {this.state.showOldPassword
                                            ? "Hide"
                                            : "Show"}
                                    </Button>
                                </InputGroupAddon>
                                {errors.data &&
                                    errors.data.password && (
                                        <div className="invalid-feedback">
                                            {errors.data.password}
                                        </div>
                                    )}
                            </InputGroup>
                        </FormGroup>
                        <FormGroup>
                            <Label for="newPassword">New Password</Label>
                            <InputGroup>
                                <Input
                                    className={classnames("", {
                                        "is-invalid":
                                            errors.data &&
                                            errors.data.newPassword
                                    })}
                                    type={
                                        this.state.showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="newPassword"
                                    id="newPassword"
                                    value={this.state.newPassword}
                                    onChange={this.onPasswordChange}
                                />
                                <InputGroupAddon addonType="append">
                                    <Button onClick={this.togglePassword}>
                                        {this.state.showPassword
                                            ? "Hide"
                                            : "Show"}
                                    </Button>
                                </InputGroupAddon>
                                {errors.data &&
                                    errors.data.newPassword && (
                                        <div className="invalid-feedback">
                                            {errors.data.newPassword}
                                        </div>
                                    )}
                            </InputGroup>
                            <Progress
                                max="5"
                                value={this.state.passwordScore}
                                color={this.state.passwordColor}
                                style={{ marginTop: ".5em" }}
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label for="newPassword2">
                                Confirm New Password
                            </Label>
                            <Input
                                className={classnames("", {
                                    "is-invalid":
                                        errors.data && errors.data.newPassword2
                                })}
                                type={
                                    this.state.showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="newPassword2"
                                id="newPassword2"
                                value={this.state.newPassword2}
                                onChange={this.onChange}
                            />
                            {errors.data &&
                                errors.data.newPassword2 && (
                                    <div className="invalid-feedback">
                                        {errors.data.newPassword2}
                                    </div>
                                )}
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" type="submit">
                            Update Password
                        </Button>{" "}
                        <Button color="secondary" onClick={this.closeModal}>
                            Cancel
                        </Button>
                    </ModalFooter>
                </Form>
            </Modal>
        );
    }
}

ChangePassword.propTypes = {
    toggleModal: PropTypes.func.isRequired,
    changePassword: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    isOpen: state.openModal === "changePasswordModal",
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { toggleModal, changePassword }
)(ChangePassword);
