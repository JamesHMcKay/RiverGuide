import classnames from "classnames";
import React, { Component } from "react";
import { connect } from "react-redux";
import { IState } from "../../reducers/index";

import { toggleModal } from "../../actions/actions";
import { loginUser } from "../../actions/getAuth";
import { IErrors, ILoginDetails } from "../../utils/types";

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

interface IWelcomeState {
    email: string;
    password: string;
    showPassword: boolean;
    errors?: IErrors;
}

interface IWelcomeStateProps {
    errors: IErrors;
    isOpen: boolean;
}

interface IWelcomeProps extends IWelcomeStateProps {
    toggleModal: (modal?: string) => void;
    loginUser: (details: ILoginDetails) => void;
}

class Welcome extends Component<IWelcomeProps, IWelcomeState> {
    constructor(props: IWelcomeProps) {
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

    public componentWillReceiveProps(nextProps: IWelcomeProps): void {
        if (nextProps.errors) {
            this.setState({ errors: nextProps.errors });
        }
    }

    public togglePassword(): void {
        this.setState({ showPassword: !this.state.showPassword });
    }

    public onEmailChange = (e: any): void => {
        this.setState({ email: e.target.value });
    }

    public onPasswordChange = (e: any): void => {
        this.setState({ password: e.target.value });
    }

    public onSubmit(e: any): void {
        e.preventDefault();

        const userData: ILoginDetails = {
            identifier: this.state.email,
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
                <ModalHeader toggle={this.closeModal}>Welcome!</ModalHeader>
                <Form onSubmit={this.onSubmit}>
                    <ModalBody>
                        <p>Please login to begin</p>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input
                                className={classnames("", {
                                    "is-invalid":
                                        errors.data && errors.data.email,
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

function mapStateToProps(state: IState): IWelcomeStateProps {
    return ({
        isOpen: state.openModal === "welcomeModal",
        errors: state.errors,
    });
}

export default connect(
    mapStateToProps,
    { toggleModal, loginUser },
)(Welcome);
