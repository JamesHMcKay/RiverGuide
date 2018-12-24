import React, { Component } from "react";
import PropTypes, { string } from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { toggleModal } from "../actions/actions";

// Material UI
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";

import { State } from '../reducers/index';
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
    { name: "T's & C's", route: "terms-conditions" }
];

const userMenuItems: IMenuItem[] = [
    { name: "My profile", route: "profile" },
    { name: "River logbook", route: "profile" },
    { name: "Logout", route: "/", modal: "logoutModal" }
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
            mapView: true
        };
    }

    handleMenu = (event: any) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    openModal = (modalName: string) => {
        this.props.toggleModal(modalName);
    };

    handleItemSelect = (item: IMenuItem) => {
        this.handleClose();
        if (item.modal) {
            this.openModal(item.modal);
        } else {
            this.setState({ mapView: false });
        }
    };

    handleMapLink = () => {
        this.setState({ mapView: true });
    };

    render() {
        const { anchorEl } = this.state;
        const {isAuthenticated} = this.props.auth;
        const menu =
            Boolean(anchorEl) && anchorEl.name === "about"
                ? aboutMenuItems
                : userMenuItems;

        // user is not authenticated
        const noAuthButtons = (
            <div className="no-auth-buttons">
                <Button
                    onClick={this.openModal.bind(this, "registerModal")}
                    variant="contained"
                    color="secondary"
                    size="large"
                    style={{
                        marginRight: "1em"
                    }}
                >
                    Get started
                </Button>
                <Button
                    color="primary"
                    onClick={this.openModal.bind(this, "loginModal")}
                >
                    Sign in
                </Button>
            </div>
        );

        // user is authenticated
        const authButtons = (
            <div className="auth-buttons">
                <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    onClick={this.openModal.bind(this, "addTrip")}
                    style={{
                        marginRight: "1em"
                    }}
                >
                    Log a trip
                </Button>
                <Button color="primary" onClick={this.handleMenu} name="user">
                    {/* {this.props.auth.user.name} */}
                    {/* <img
                        src={this.props.auth.user.avatar}
                        height="30px"
                        width="30px"
                        alt="User Avatar"
                    /> */}
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
                                    horizontal: "left"
                                }}
                                transformOrigin={{
                                    vertical: "top",
                                    horizontal: "left"
                                }}
                                onClose={this.handleClose}
                            >
                                {menu.map((item, idx) => (
                                    <Link to={item.route}
                                    key={idx}>
                                        <MenuItem
                                            key={idx}
                                            onClick={this.handleItemSelect.bind(
                                                this,
                                                item
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
                                    <h1> RiverWiki</h1>
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

NavBar.propTypes = {
    toggleModal: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = (state: State) => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { toggleModal }
)(NavBar);
