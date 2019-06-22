import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { setTabIndex, toggleModal } from "../actions/actions";

// Material UI
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Toolbar from "@material-ui/core/Toolbar";

import { IState } from "../reducers/index";
import { IAuth } from "../utils/types";

// Components
import logo from "../img/RiverWikiLogo.png";

// Styles
import "./Navbar.css";

export interface IMenuItem {
    name: string;
    route: string;
    modal?: string;
}

const userMenuItems: IMenuItem[] = [
    { name: "My profile", route: "profile" },
];

interface INavBarProps {
    toggleModal: (modal: string) => void;
    auth: IAuth;
    setTabIndex: (index: number) => void;
}

interface INavBarState {
    anchorEl: any;
    mapView: boolean;
}

class NavBar extends Component<INavBarProps, INavBarState> {
    constructor(props: INavBarProps) {
        super(props);
        this.state = {
            anchorEl: null,
            mapView: true,
        };
    }

    public handleMenu = (event: any): void => {
        this.setState({ anchorEl: event.currentTarget });
    }

    public handleClose = (): void => {
        this.setState({ anchorEl: null });
    }

    public openModal = (modalName: string): void => {
        this.props.toggleModal(modalName);
    }

    public handleItemSelect = (item: IMenuItem): void => {
        this.handleClose();
        if (item.modal) {
            this.openModal(item.modal);
        } else {
            this.setState({ mapView: false });
        }
    }

    public handleMapLink = (): void => {
        this.setState({ mapView: true });
    }

    public handleProfileLink = (): void => {
        this.setState({ mapView: false });
    }

    public render(): JSX.Element {
        const { anchorEl } = this.state;
        const {isAuthenticated} = this.props.auth;

        // user is not authenticated
        const noAuthButtons: JSX.Element = (
            <div className="no-auth-buttons">
                <Button
                    onClick={this.openModal.bind(this, "registerModal")}
                    color="primary"
                    style={{
                        marginRight: "1em",
                    }}
                >
                    Sign up
                </Button>
                <Button
                    color="primary"
                    onClick={this.openModal.bind(this, "loginModal")}
                >
                    Log in
                </Button>
            </div>
        );

        // user is authenticated
        const authButtons: JSX.Element = (
            <div className="auth-buttons">
                <Button
                    color="primary"
                    size="large"
                    onClick={this.openModal.bind(this, "addTripAnyPage")}
                    style={{
                        marginRight: "1em",
                    }}
                >
                    Log a trip
                </Button>
                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={this.handleMenu}>
                    Profile
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    {userMenuItems.map((item: IMenuItem) => (
                        <Link
                            to={item.route}
                            key={item.name}
                            onClick={(event: any): void => {this.props.setTabIndex(-1); }}
                        >
                            <MenuItem key={item.name} onClick={this.handleClose}>{item.name}</MenuItem>
                        </Link>
                    ))}
                    <MenuItem
                        key={"logout"}
                        onClick={(event: any): void => {
                            this.openModal("logoutModal");
                            this.setState({ anchorEl: null });
                        }}
                    >
                        {"Logout"}
                    </MenuItem>
                </Menu>
            </div>
        );

        return (
            <div>
                <AppBar position="static">
                    <Toolbar style={{ background: "#fff" }}>
                        <div className="centered-logo">
                            <Link to="/" onClick={this.handleMapLink}>
                                <div>
                                    <img
                                        src={logo}
                                        alt=""
                                        className="nav-logo"
                                    />
                                </div>
                            </Link>
                        </div>
                        {isAuthenticated ? authButtons : noAuthButtons}
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

const mapStateToProps: (state: IState) => {auth: IAuth} = (state: IState): {auth: IAuth} => ({
    auth: state.auth,
});

export default connect(
    mapStateToProps,
    { toggleModal, setTabIndex },
)(NavBar);
