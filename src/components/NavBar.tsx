import PropTypes, { string } from "prop-types";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { toggleModal } from "../actions/actions";

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

const aboutMenuItems: IMenuItem[] = [
    { name: "Our vision", route: "vision" },
    { name: "Meet the team", route: "team" },
    { name: "Contact us", route: "contact" },
    { name: "T's & C's", route: "terms-conditions" },
];

const userMenuItems: IMenuItem[] = [
    { name: "My profile", route: "profile" },
    { name: "River logbook", route: "profile" },
    { name: "Logout", route: "/", modal: "logoutModal" },
];

interface INavBarProps {
    toggleModal: (modal: string) => void;
    auth: IAuth;
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

    public render(): JSX.Element {
        const { anchorEl } = this.state;
        const {isAuthenticated} = this.props.auth;
        const menu: IMenuItem[] =
            Boolean(anchorEl) && anchorEl.name === "about"
                ? aboutMenuItems
                : userMenuItems;

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
                <Button color="primary" onClick={this.handleMenu} name="user">
                    My profile
                </Button>
            </div>
        );

        return (
            <div>
                <AppBar position="static">
                    <Toolbar style={{ background: "#fff" }}>
                        <div className="about-buttons">
                            <Button
                                color="primary"
                                size="large"
                                onClick={this.handleMenu}
                                name="about"
                            >
                                About us
                            </Button>
                            {!this.state.mapView && (
                                <Link to="">
                                    <Button
                                        color="secondary"
                                        onClick={this.handleMapLink}
                                    >
                                        Map view
                                    </Button>
                                </Link>
                            )}
                            <Menu
                                open={Boolean(anchorEl)}
                                anchorEl={anchorEl}
                                getContentAnchorEl={null}
                                anchorOrigin={{
                                    vertical: "bottom",
                                    horizontal: "left",
                                }}
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "left",
                                }}
                                onClose={this.handleClose}
                            >
                                {menu.map((item: IMenuItem, idx: number) => (
                                    <Link to={item.route}
                                    key={idx}>
                                        <MenuItem
                                            key={idx}
                                            onClick={this.handleItemSelect.bind(
                                                this,
                                                item,
                                            )}
                                        >
                                            {item.name}
                                        </MenuItem>
                                    </Link>
                                ))}
                            </Menu>
                        </div>
                        <div className="centered-logo">
                            <Link to="/" onClick={this.handleMapLink}>
                                <div>
                                    <img
                                        src={logo}
                                        alt=""
                                        className="nav-logo"
                                    />
                                    <h1></h1>
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
    { toggleModal },
)(NavBar);
