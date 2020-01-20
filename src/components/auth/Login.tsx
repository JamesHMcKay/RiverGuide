import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green } from "@material-ui/core/colors";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import withMobileDialog from "@material-ui/core/withMobileDialog";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import React, { Component } from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions/actions";
import { loginUser, registerUser } from "../../actions/getAuth";
import { IState } from "../../reducers/index";
import DialogTitle from "../../utils/dialogTitle";
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
    fullScreen: boolean;
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

    public onSignUpClick = (): void => {
        this.props.toggleModal("registerModal");
    }

    public handleClickShowPassword = (): void => {
        this.setState({ showPassword: !this.state.showPassword });
    }

    public render(): JSX.Element {
        const providers: string[] = ["facebook", "google"];
        const errorBoxColor: string = !this.state.errors || !this.state.errors.message ? "white" : "orange";
        return (
            <div>
                <Dialog
                    onClose={this.closeModal}
                    aria-labelledby="example dialog"
                    open={this.props.isOpen}
                    fullScreen={this.props.fullScreen}
                    maxWidth={"xs"}
                >
                <DialogTitle handleClose={this.closeModal} title={"Login"}/>
                <DialogContent>

                <div className = "provider-button-stack">
                    {providers.map((provider: string) =>
                        <SocialLink pretext = "Log in with " provider={provider} key={provider} />)}
                </div>

                <DialogContentText align = "center" variant = "h6">
                        {"- or -"}
                </DialogContentText>
                <div style={{justifyContent: "center", width: "90%", margin: "auto"}} >
                    <TextField
                            id="email"
                            style={{width: "100%"}}
                            label="Email"
                            margin="dense"
                            variant="outlined"
                            onChange={this.onChangeEmail}
                            value={this.state.identifier}
                        />
                    <TextField
                                id="password"
                                margin="dense"
                                variant="outlined"
                                style={{width: "100%"}}
                                type={this.state.showPassword ? "text" : "password"}
                                label="Password"
                                value={this.state.password}
                                onChange={this.onChangePassword}
                                InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                    <IconButton
                                        edge="end"
                                        aria-label="toggle password visibility"
                                        onClick={this.handleClickShowPassword}
                                    >
                                        {this.state.showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                    </InputAdornment>
                                ),
                                }}
                    />
                </div>
                {this.state.errors &&
                <div style={{backgroundColor: errorBoxColor, borderRadius: "5px", padding: "5px"}}>
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
                <DialogContentText align = "center" variant = "h6">
                        {"- or -"}
                </DialogContentText>
                <div
                    style={{
                        margin: "1em",
                        position: "relative",
                    }}
                >
                    <Button
                        variant = "contained"
                        color="primary"
                        onClick={this.onSignUpClick}
                        fullWidth
                    >
                                Sign up
                    </Button>
                    </div>

                </DialogContent>
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
)(withMobileDialog()(Login));
