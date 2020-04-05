import { Button, CircularProgress, List, TextField } from "@material-ui/core";
import { green } from "@material-ui/core/colors";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import InputAdornment from "@material-ui/core/InputAdornment";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import {
    toggleModal,
} from "../../actions/actions";
import { resetPassword } from "../../actions/getAuth";
import { IState } from "../../reducers/index";
import { IAuth, IErrors, IResetPasswordDetails } from "../../utils/types";

import "./profile.css";

interface IResetPasswordPageState {
    identifier: string;
    password: string;
    password2: string;
    showPassword: boolean;
    errors?: IErrors;
    loading: boolean;
    code: string | null;
    preError: string;
}

interface IResetPasswordPageProps extends IResetPasswordPageStateProps {
    resetPassword: (user: IResetPasswordDetails) => void;
    toggleModal: (modal: string) => void;
    location: any;
}

interface IResetPasswordPageStateProps {
    loadingSpinner: string;
    errors: IErrors;
    passwordResetSuccess: boolean;
    auth: IAuth;
}

class ResetPassword extends Component<IResetPasswordPageProps, IResetPasswordPageState> {
    constructor(props: IResetPasswordPageProps) {
        super(props);
        const urlParams: URLSearchParams = new URLSearchParams(this.props.location.search);
        this.state = {
            identifier: "",
            password: "",
            password2: "",
            showPassword: false,
            loading: false,
            code: urlParams.get("code"),
            preError: "",
        };
    }

    public componentWillReceiveProps = (nextProps: IResetPasswordPageProps): void => {
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors,
                loading: false,
            });
        }
    }

    public onChangePassword = (e: any): void => {
        this.setState({ password: e.target.value });
    }

    public onChangePassword2 = (e: any): void => {
        this.setState({ password2: e.target.value });
    }

    public resetPassword = (e: any): void => {
        this.props.resetPassword({
            code: this.state.code ? this.state.code : "",
            password: this.state.password,
            confirmPassword: this.state.password2,
        });
    }

    public handleClickShowPassword = (): void => {
        this.setState({ showPassword: !this.state.showPassword });
    }

    public render(): JSX.Element {
        const errorBoxColor: string = !this.state.errors || !this.state.errors.message ? "white" : "orange";
        return (
            <Grid container spacing={0} justify={"center"} style={{height: "82vh", borderTop: "1px solid #e6e6eb"}}>
                <List style={{ width: "100%", maxWidth: 360}}>
                <div style={{justifyContent: "center", width: "90%", margin: "auto"}} >
                    <TextField
                                id="password"
                                margin="dense"
                                variant="outlined"
                                style={{width: "100%"}}
                                type={this.state.showPassword ? "text" : "password"}
                                label="New password"
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
                   <TextField
                            id="password2"
                            margin="dense"
                            variant="outlined"
                            style={{width: "100%"}}
                            type={this.state.showPassword ? "text" : "password"}
                            label="Confirm new password"
                            value={this.state.password2}
                            onChange={this.onChangePassword2}
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
            {this.state.errors &&
                <div style={{backgroundColor: errorBoxColor, borderRadius: "5px", padding: "5px"}}>
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
                {(!this.props.passwordResetSuccess && !this.props.auth.isAuthenticated) &&
                                    <Button
                                    variant = "contained"
                                    color="primary"
                                    onClick={this.resetPassword}
                                    disabled={this.props.loadingSpinner === "resetPassword"}
                                    fullWidth>
                                            Reset password
                                </Button>
                }
                {(this.props.passwordResetSuccess && !this.props.auth.isAuthenticated) &&
                    <Button
                    variant = "contained"
                    color="primary"
                    onClick={(): void => {this.props.toggleModal("loginModal"); }}
                    disabled={this.state.loading}
                    fullWidth>
                            Password reset successful -click to login
                </Button>
                }
                {(this.props.auth.isAuthenticated) &&
                <Link to="/">
                     <Button
                    variant = "contained"
                    color="primary"
                    fullWidth>
                            You are logged in - return to the RiverGuide
                    </Button>
                </Link>
                }
                {this.props.loadingSpinner === "resetPassword" &&
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
                </div>
                </List>
            </Grid>
        );
    }

}

function mapStateToProps(state: IState): IResetPasswordPageStateProps {
    return ({
        loadingSpinner: state.loadingSpinner,
        errors: state.errors,
        passwordResetSuccess: state.passwordResetSuccess,
        auth: state.auth,
    });
}

export default connect(
    mapStateToProps,
    { resetPassword, toggleModal},
)(ResetPassword);
