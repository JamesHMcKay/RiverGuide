import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import green from "@material-ui/core/colors/green";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { registerUser } from "../../actions/getAuth";
import { IState } from "../../reducers/index";
import { IAuth, IRegisterData } from "../../utils/types";
import SocialLink from "./SocialLink";

interface IRegisterState {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    password2: string;
    showPassword: boolean;
    passwordScore: number;
    passwordColor: string;
    errors: any;
    loading: boolean;
}

interface IRegisterPropsState {
    auth: IAuth;
    errors: any;
    isOpen: boolean;
}

interface IReigsterProps extends IRegisterPropsState {
    toggleModal: (modal?: string) => void;
    registerUser: (userData: IRegisterData) => void;
}
class Register extends Component<IReigsterProps, IRegisterState> {
    constructor(props: IReigsterProps) {
        super(props);
        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            password2: "",
            showPassword: false,
            passwordScore: 0,
            passwordColor: "",
            errors: {},
            loading: false,
        };
    }

    public componentWillReceiveProps = (nextProps: IReigsterProps): void => {
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors,
                loading: false,
            });
        }
    }

    public onChangeEmail = (e: any): void => {
        this.setState({ email: e.target.value });
    }

    public onChangePassword = (e: any): void => {
        this.setState({ password: e.target.value });
    }

    public onRegister = (e: any): void => {
            e.preventDefault();
            this.setState({
                loading: true,
            });
            const newUser: IRegisterData = {
                name: this.state.firstName + this.state.lastName,
                email: this.state.email,
                password: this.state.password,
                password2: this.state.password,
            };

            this.props.registerUser(newUser);
    }

    public closeModal = (): void => {
        this.props.toggleModal();
    }

    public handleClickShowPassword = (): void => {
        this.setState({ showPassword: !this.state.showPassword });
    }

    public changeEntry = (e: any): void => {
        const state: IRegisterState = this.state;
        state[e.target.id as keyof IRegisterState] = e.target.value;
        this.setState({
            ...state,
        });
    }

    public render(): JSX.Element {
        const providers: string[] = ["facebook", "google"];

        return (
            <div>
                <Dialog onClose={this.closeModal} aria-labelledby="example dialog" open={this.props.isOpen}>
                <DialogContent>

                <div className = "provider-button-stack">
                    {providers.map((provider: string) =>
                        <SocialLink pretext = "Sign up with " provider={provider} key={provider} />)}
                </div>

                <DialogContentText align = "center" variant = "h6">
                        {"- or -"}
                    </DialogContentText>

                    <DialogContentText>
                        {"First name"}
                    </DialogContentText>
                    <Input
                    id="firstName"
                    type={"text"}
                    value={this.state.firstName}
                    onChange={this.changeEntry}
                    fullWidth
                    />
                    <DialogContentText>
                    {"Last name"}
                    </DialogContentText>
                    <Input
                    id="lastName"
                    type={"text"}
                    value={this.state.lastName}
                    onChange={this.changeEntry}
                    fullWidth
                    />

                    <DialogContentText>
                    {"Email"}
                    </DialogContentText>
                    <Input
                    id="email"
                    type={"text"}
                    value={this.state.email}
                    onChange={this.changeEntry}
                    fullWidth
                    />

                    <DialogContentText>
                        {"Password"}
                    </DialogContentText>

                    <Input
                    id="password"
                    type={this.state.showPassword ? "text" : "password"}
                    value={this.state.password}
                    onChange={this.changeEntry}
                    fullWidth
                    endAdornment={
                    <InputAdornment position="end">
                    <IconButton aria-label="Toggle password visibility" onClick={this.handleClickShowPassword}>
                    {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                    </InputAdornment>
                    }
                    />
                {this.state.errors &&
                <div>
                    {this.state.errors.message}
                </div>}
                <div
                    style={{
                        margin: "1em",
                        position: "relative",
                    }}
                >
                    <Button
                        variant = "contained"
                        color="primary"
                        onClick={this.onRegister}
                        disabled={this.state.loading}
                        fullWidth>
                                Sign up
                    </Button>
                    {this.state.loading &&
                        <CircularProgress
                            size={24}
                            style={{
                                color: green[500],
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                marginTop: -12,
                                marginLeft: -12,
                            }}
                        />
                    }
                </div>

                </DialogContent>
                <DialogActions>
                    <Button onClick={this.closeModal} color="primary">
                    Cancel
                    </Button>
                </DialogActions>

                </Dialog>
            </div>
        );
    }
}

function mapStateToProps(state: IState): IRegisterPropsState {
    return ({
        isOpen: state.openModal === "registerModal",
        auth: state.auth,
        errors: state.errors,
    });
}

export default connect(
    mapStateToProps,
    { toggleModal, registerUser },
)(Register);
