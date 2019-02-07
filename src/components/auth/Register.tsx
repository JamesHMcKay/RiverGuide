import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import zxcvbn from "zxcvbn";
import { State } from '../../reducers/index';
import { toggleModal, registerUser } from "../../actions/actions";
import { IRegisterData, IAuth } from '../../utils/types';

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

interface IRegisterState {
    name: string;
    email: string;
    password: string;
    password2: string;
    showPassword: boolean;
    passwordScore: number;
    passwordColor:  string;
    errors: any;
}

interface IReigsterProps {
    isOpen: boolean;
    toggleModal: (modal?: string) => void;
    registerUser: (userData: IRegisterData) => void,
    auth: IAuth,
    errors: any
}

class Register extends Component<IReigsterProps, IRegisterState> {
    constructor(props: IReigsterProps) {
        super(props);
        this.state = {
            name: "",
            email: "",
            password: "",
            password2: "",
            showPassword: false,
            passwordScore: 0,
            passwordColor: "",
            errors: {}
        };

        this.closeModal = this.closeModal.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.togglePassword = this.togglePassword.bind(this);
        this.onPasswordChange = this.onPasswordChange.bind(this);
    }

    componentDidMount() {
        if (this.props.auth.isAuthenticated) {
            // Close modal
        }
    }

    componentWillReceiveProps(nextProps: IReigsterProps) {
        if (nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }
    }

    togglePassword() {
        this.setState({ showPassword: !this.state.showPassword });
    }

    onNameChange = (e: any): void => {
        this.setState({ name: e.target.value });
    }

    onEmailChange = (e: any): void => {
        this.setState({ email: e.target.value });
    }

    onPassword2Change = (e: any): void => {
        this.setState({ password2: e.target.value });
    }

    onPasswordChange(e: any) {
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
            password: e.target.value,
            passwordScore: score,
            passwordColor: color
        });
    }

    onSubmit(e: any) {
        e.preventDefault();

        const newUser: IRegisterData = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2
        };

        this.props.registerUser(newUser);
    }

    closeModal() {
        this.props.toggleModal();
    }

    render() {
        const { errors } = this.state;

        return (
            <Modal isOpen={this.props.isOpen} toggle={this.closeModal}>
                <ModalHeader toggle={this.closeModal}>Welcome!</ModalHeader>
                <Form onSubmit={this.onSubmit}>
                    <ModalBody>
                        <FormGroup>
                            <Label for="name">Full Name</Label>
                            <Input
                                className={classnames("", {
                                    "is-invalid":
                                        errors.data && errors.data.name
                                })}
                                type="text"
                                name="name"
                                id="name"
                                value={this.state.name}
                                onChange={this.onNameChange}
                            />
                            {errors.data &&
                                errors.data.name && (
                                    <div className="invalid-feedback">
                                        {errors.data.name}
                                    </div>
                                )}
                        </FormGroup>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input
                                className={classnames("", {
                                    "is-invalid":
                                        errors.data && errors.data.email
                                })}
                                type="text"
                                name="email"
                                id="email"
                                value={this.state.email}
                                onChange={this.onEmailChange}
                            />
                            {errors.data &&
                                errors.data.email && (
                                    <div className="invalid-feedback">
                                        {errors.data.email}
                                    </div>
                                )}
                            <small className="form-text text-muted">
                                This site uses Gravatar so if you want a profile
                                image, use a Gravatar email
                            </small>
                        </FormGroup>
                        <FormGroup>
                            <Label for="password">Password</Label>
                            <InputGroup>
                                <Input
                                    className={classnames("", {
                                        "is-invalid":
                                            errors.data && errors.data.password
                                    })}
                                    type={
                                        this.state.showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    id="password"
                                    value={this.state.password}
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
                                    errors.data.password && (
                                        <div className="invalid-feedback">
                                            {errors.data.password}
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
                            <Label for="password2">Confirm Password</Label>
                            <InputGroup>
                                <Input
                                    className={classnames("", {
                                        "is-invalid":
                                            errors.data && errors.data.password2
                                    })}
                                    type={
                                        this.state.showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password2"
                                    id="password2"
                                    value={this.state.password2}
                                    onChange={this.onPassword2Change}
                                />
                                {errors.data &&
                                    errors.data.password2 && (
                                        <div className="invalid-feedback">
                                            {errors.data.password2}
                                        </div>
                                    )}
                            </InputGroup>
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" type="submit">
                            Register
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

Register.propTypes = {
    toggleModal: PropTypes.func.isRequired,
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = (state: State) => ({
    isOpen: state.openModal === "registerModal",
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { toggleModal, registerUser }
)(Register);
