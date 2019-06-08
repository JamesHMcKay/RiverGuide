import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green } from "@material-ui/core/colors";
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
import { loginUser, registerUser } from "../../actions/getAuth";
import { IState } from "../../reducers/index";
import { IErrors, ILoginDetails, IRegisterData } from "../../utils/types";
import SocialLink from "./SocialLink";

interface ILoginState {
    identifier: string;
    password: string;
    showPassword: boolean;
    errors?: IErrors;
    loading: boolean;
}

interface ILoginStateProps {
    errors: IErrors;
    isOpen: boolean;
}

interface ILoginProps extends ILoginStateProps {
    toggleModal: (modal?: string) => void;
    loginUser: (details: ILoginDetails) => void;
    registerUser: (userData: IRegisterData) => void;
}

class Login extends Component<ILoginProps, ILoginState> {
    constructor(props: ILoginProps) {
        super(props);
        this.state = {
            identifier: "",
            password: "",
            showPassword: false,
            loading: false,
        };
    }

    public componentWillReceiveProps = (nextProps: ILoginProps): void => {
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors,
                loading: false,
            });
        }
    }

    public onChangeEmail = (e: any): void => {
        this.setState({ identifier: e.target.value });
    }

    public onChangePassword = (e: any): void => {
        this.setState({ password: e.target.value });
    }

    public onLogin = (e: any): void => {
        e.preventDefault();

        const userData: ILoginDetails = {
            identifier: this.state.identifier,
            password: this.state.password,
        };
        this.setState({
            loading: true,
        });

        this.props.loginUser(userData);
    }

    public closeModal = (): void => {
        this.props.toggleModal();
    }

    public handleClickShowPassword = (): void => {
        this.setState({ showPassword: !this.state.showPassword });
    }

    public render(): JSX.Element {
        const providers: string[] = ["facebook", "google"];

        return (
            <div>
                <Dialog onClose={this.closeModal} aria-labelledby="example dialog" open={this.props.isOpen}>
                <DialogContent>

                <div className = "provider-button-stack">
                    {providers.map((provider: string) =>
                        <SocialLink pretext = "Log in with " provider={provider} key={provider} />)}
                </div>

                <DialogContentText align = "center" variant = "h6">
                        {"- or -"}
                    </DialogContentText>

                    <DialogContentText>
                        {"Email"}
                    </DialogContentText>
                    <Input
                    id="username"
                    type={"text"}
                    value={this.state.identifier}
                    onChange={this.onChangeEmail}
                    fullWidth
                    />

                    <DialogContentText>
                        {"Password"}
                    </DialogContentText>

                    <Input
                    id="adornment-password"
                    type={this.state.showPassword ? "text" : "password"}
                    value={this.state.password}
                    onChange={this.onChangePassword}
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
                        onClick={this.onLogin}
                        disabled={this.state.loading}
                        fullWidth>
                                Login
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

function mapStateToProps(state: IState): ILoginStateProps {
    return ({
        isOpen: state.openModal === "loginModal",
        errors: state.errors,
    });
}

export default connect(
    mapStateToProps,
    { toggleModal, loginUser, registerUser},
)(Login);
