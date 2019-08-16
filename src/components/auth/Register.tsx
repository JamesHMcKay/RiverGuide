import Button from "@material-ui/core/Button";
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
import { registerUser } from "../../actions/getAuth";
import content from "../../content/sign_up_content.json";
import { IState } from "../../reducers/index";
import DialogTitle from "../../utils/dialogTitle";
import loadingButton from "../../utils/loadingButton";
import { IAuth, IRegisterData } from "../../utils/types";
import SocialLink from "./SocialLink";
import { createStyles, Theme } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles: any = (theme: Theme): any => createStyles({
    dialogPaper: {
        minHeight: '80vh',
        maxHeight: '95vh',
    },
});

interface IRegisterState {
    firstName: string;
    email: string;
    password: string;
    password2: string;
    showPassword: boolean;
    passwordScore: number;
    passwordColor: string;
    errors: any;
    loading: boolean;
    preError: string;
}

interface IRegisterPropsState {
    auth: IAuth;
    errors: any;
    isOpen: boolean;
}

interface IReigsterProps extends IRegisterPropsState {
    toggleModal: (modal?: string) => void;
    registerUser: (userData: IRegisterData) => void;
    fullScreen: boolean;
    classes: any;
}
class Register extends Component<IReigsterProps, IRegisterState> {
    constructor(props: IReigsterProps) {
        super(props);
        this.state = {
            firstName: "",
            email: "",
            password: "",
            password2: "",
            showPassword: false,
            passwordScore: 0,
            passwordColor: "",
            errors: {},
            loading: false,
            preError: "",
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

    public checkValid = (): boolean => {
        const allFields: boolean = this.state.password !== "" &&
            this.state.password2 !== "" &&
            this.state.firstName !== "" &&
            this.state.email !== "";
        if (!allFields) {
            this.setState({
                preError: "Complete all fields",
            });
            return false;
        }

        const passwordsMatch: boolean = this.state.password === this.state.password2;
        if (!passwordsMatch) {
            this.setState({
                preError: "Passwords don't match",
            });
            return false;
        }

        this.setState({
            preError: "",
        });
        return allFields && passwordsMatch;
    }

    public onRegister = (e: any): void => {
            e.preventDefault();

            if (!this.checkValid()) {
                return;
            }

            this.setState({
                loading: true,
            });
            const newUser: IRegisterData = {
                name: this.state.firstName,
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
        const { classes } = this.props;
        const providers: string[] = ["facebook", "google"];
        return (
            <div>
                <Dialog
                    classes={{ paper: classes.dialogPaper }}
                    onClose={this.closeModal}
                    aria-labelledby="example dialog"
                    open={this.props.isOpen}
                    fullScreen={this.props.fullScreen}
                    maxWidth={"xs"}
                >
                <DialogTitle handleClose={this.closeModal} title={"Sign up"}/>
                <DialogContentText style = {{
                    width: "90%",
                    marginLeft: "auto",
                    marginRight: "auto",
                    marginBottom: "0px",
                    textAlign: "justify",
                    paddingTop: "10px",
                }}>
                <div
                    dangerouslySetInnerHTML={{
                        __html: content.sign_up_terms,
                    }}
                />
                </DialogContentText>
                <DialogContent>
                <div className = "provider-button-stack">
                    {providers.map((provider: string) =>
                        <SocialLink pretext = "Sign up with " provider={provider} key={provider} />)}
                </div>
                <DialogContentText align = "center" variant = "h6" style={{marginBottom: "3px"}}>
                        {"- or -"}
                </DialogContentText>
                <div style={{justifyContent: "center", width: "90%", margin: "auto"}} >
                    <TextField
                        id="firstName"
                        style={{width: "100%", justifyContent: "center"}}
                        label="Name"
                        // type="search"
                        margin="dense"
                        variant="outlined"
                        onChange={this.changeEntry}
                        value={this.state.firstName}
                    />
                    <TextField
                        id="email"
                        style={{width: "100%"}}
                        label="Email"
                        margin="dense"
                        variant="outlined"
                        onChange={this.changeEntry}
                        value={this.state.email}
                    />
                    <TextField
                            id="password"
                            margin="dense"
                            variant="outlined"
                            style={{width: "100%"}}
                            type={this.state.showPassword ? "text" : "password"}
                            label="Password"
                            value={this.state.password}
                            onChange={this.changeEntry}
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
                    <TextField
                            id="password2"
                            margin="dense"
                            variant="outlined"
                            style={{width: "100%"}}
                            type={this.state.showPassword ? "text" : "password"}
                            label="Confirm password"
                            value={this.state.password2}
                            onChange={this.changeEntry}
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
                <div>
                    {this.state.errors.message}
                </div>}
                {this.state.preError !== "" &&
                <div>
                    {this.state.preError}
                </div>}
                <div
                    style={{
                        marginTop: "1em",
                        marginBottom: "1em",
                        marginLeft: "auto",
                        marginRight: "auto",
                        width: "90%",
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
                    {this.state.loading && loadingButton()}
                </div>
                </DialogContent>
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
)(withMobileDialog()(withStyles(styles)(Register)));
