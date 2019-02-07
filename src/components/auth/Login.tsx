import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import classnames from "classnames";
import { State } from '../../reducers/index';
import { ILoginDetails } from '../../utils/types';

import { toggleModal, loginUser } from "../../actions/actions";

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
    ModalHeader
} from "reactstrap";

interface ILoginState {
    email: string;
    password: string;
    showPassword: boolean;
    errors: any;
}

interface ILoginProps {
    errors: any;
    isOpen: boolean;
    toggleModal: (modal?: string) => void;
    loginUser: (details: ILoginDetails) => void;
}

class Login extends Component<ILoginProps, ILoginState> {
    constructor(props: ILoginProps) {
        super(props);
        this.state = {
            email: "",
            password: "",
            showPassword: false,
            errors: {}
        };

        this.closeModal = this.closeModal.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.togglePassword = this.togglePassword.bind(this);
    }

    componentWillReceiveProps(nextProps: ILoginProps) {
        if (nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }
    }

    togglePassword() {
        this.setState({ showPassword: !this.state.showPassword });
    }

    onChangeEmail = (e: any): void => {
        this.setState({ email: e.target.value });
    }

    onChangePassword = (e: any): void => {
        this.setState({ password: e.target.value });
    }

    onSubmit(e: any) {
        e.preventDefault();

        const userData: ILoginDetails = {
            email: this.state.email,
            password: this.state.password
        };

        this.props.loginUser(userData);
    }

    closeModal() {
        this.props.toggleModal();
    }

    render() {
        const { errors } = this.state;

        return (
            <Modal isOpen={this.props.isOpen} toggle={this.closeModal}>
                <ModalHeader toggle={this.closeModal}>
                    Welcome back!
                </ModalHeader>
                <Form onSubmit={this.onSubmit}>
                    <ModalBody>
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
                                onChange={this.onChangeEmail}
                            />
                            {errors.data &&
                                errors.data.email && (
                                    <div className="invalid-feedback">
                                        {errors.data.email}
                                    </div>
                                )}
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
                                    onChange={this.onChangePassword}
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
                        </FormGroup>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" type="submit">
                            Login
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

Login.propTypes = {
    toggleModal: PropTypes.func.isRequired,
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = (state: State) => ({
    isOpen: state.openModal === "loginModal",
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    { toggleModal, loginUser }
)(Login);
