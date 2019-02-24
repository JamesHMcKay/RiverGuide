import classnames from "classnames";
import React, { Component } from "react";
import { connect } from "react-redux";
import { IState } from "../../reducers/index";
import { IErrors, ILoginDetails } from "../../utils/types";

import { loginUser, toggleModal } from "../../actions/actions";

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
} from "reactstrap";

interface ILoginState {
    email: string;
    password: string;
    showPassword: boolean;
    errors?: IErrors;
}

interface ILoginStateProps {
    errors: IErrors;
    isOpen: boolean;
}

interface ILoginProps extends ILoginStateProps {
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
        };

        this.closeModal = this.closeModal.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.togglePassword = this.togglePassword.bind(this);
    }

    public componentWillReceiveProps(nextProps: ILoginProps): void {
        if (nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }
    }

    public togglePassword(): void {
        this.setState({ showPassword: !this.state.showPassword });
    }

    public onChangeEmail = (e: any): void => {
        this.setState({ email: e.target.value });
    }

    public onChangePassword = (e: any): void => {
        this.setState({ password: e.target.value });
    }

    public onSubmit(e: any): void {
        e.preventDefault();

        const userData: ILoginDetails = {
            email: this.state.email,
            password: this.state.password,
        };

        this.props.loginUser(userData);
    }

    public closeModal(): void {
        this.props.toggleModal();
    }

    public render(): JSX.Element {
        const errors: IErrors = this.props.errors;

        return (
            <Modal isOpen={this.props.isOpen} toggle={this.closeModal}>
                <ModalHeader toggle={this.closeModal}>
                    Welcome back!
                </ModalHeader>
                <Form onSubmit={this.onSubmit}>
                    <ModalBody>
                        <FormGroup>
                            <Label for="email" >Email</Label>
                            <Input
                                className={classnames("", {
                                    "is-invalid":
                                        errors.data && errors.data.email,
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
                                            errors.data && errors.data.password,
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

function mapStateToProps(state: IState): ILoginStateProps {
    return ({
        isOpen: state.openModal === "loginModal",
        errors: state.errors,
    });
}

export default connect(
    mapStateToProps,
    { toggleModal, loginUser },
)(Login);
