import MenuIcon from "@material-ui/icons/Menu";
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
import { Typography } from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import ActivityFilter from "./ActivityFilter";
import "./Navbar.css";

export interface IMenuItem {
    name: string;
    route: string;
    modal?: string;
}

const userMenuItems: IMenuItem[] = [
    { name: "My profile", route: "profile" },
];

const AUTH_MODALS: IMenuItem[] = [
    {name: "Log a trip", route: "", modal: "addTripAnyPage"},
    {name: "Log out", route: "", modal: "logoutModal"},
];

const NO_AUTH_MODALS: IMenuItem[] = [
    {name: "Sign up", route: "", modal: "registerModal"},
    {name: "Log in", route: "", modal: "loginModal"},
];

const MODALS: IMenuItem[] = [
    {name: "Data for good", route: "", modal: "aboutModal"},
    {name: "Contact", route: "", modal: "contactModal"},
];

interface INavBarProps {
    toggleModal: (modal: string) => void;
    auth: IAuth;
    setTabIndex: (index: number) => void;
}

interface INavBarState {
    anchorEl: any;
    mapView: boolean;
    drawOpen: boolean;
}

class NavBar extends Component<INavBarProps, INavBarState> {
    constructor(props: INavBarProps) {
        super(props);
        this.state = {
            anchorEl: null,
            mapView: true,
            drawOpen: false,
        };
    }

    public handleDrawOpen = (event: any): void => {
        this.setState({
            drawOpen: true,
        });
    }

    public handleDrawClose = (event: any): void => {
        this.setState({
            drawOpen: false,
        });
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
        // this.setState({ mapView: true });
    }

    public handleProfileLink = (): void => {
        this.setState({ mapView: false });
    }

    public toggleDrawer = (open: boolean): any => (
        event: React.KeyboardEvent | React.MouseEvent,
      ): any => {
        if (
          event.type === "keydown" &&
          ((event as React.KeyboardEvent).key === "Tab" ||
            (event as React.KeyboardEvent).key === "Shift")
        ) {
          return;
        }
        this.setState({drawOpen: open });
      }

      public getListAuthenticated = (): JSX.Element => {
          return (
        <div
          style={{width: 250}}
          role="presentation"
          onClick={this.toggleDrawer(false)}
          onKeyDown={this.toggleDrawer(false)}
        >
          <List>
          <div onKeyDown={this.toggleDrawer(false)}>
                <IconButton onClick={this.handleDrawClose}>
                {<ChevronRightIcon />}
                </IconButton>
                </div>
            <Divider />

                <ListItem button key={"profile"}>
                <Link
                to={"/profile"}
                key={"profile"}
            >
                <ListItemText primary={"My profile"} />
                </Link>
                </ListItem>

          </List>
          <Divider />
          <List>
            {AUTH_MODALS.concat(MODALS).map((item: IMenuItem) => (
              <ListItem button key={item.name} onClick={(): void => {this.openModal(item.modal || ""); }}>
                <ListItemText primary={item.name} />
              </ListItem>
            ))}
          </List>
        </div>
      );
    }

    public getListNotAuthenticated = (): JSX.Element => {
        return (
      <div
        style={{width: 250}}
        role="presentation"
        onClick={this.toggleDrawer(false)}
        onKeyDown={this.toggleDrawer(false)}
      >
        <List>
        <div onKeyDown={this.toggleDrawer(false)}>
              <IconButton onClick={this.handleDrawClose}>
              {<ChevronRightIcon />}
              </IconButton>
              </div>
          <Divider />
          </List>
        <List>
          {NO_AUTH_MODALS.concat(MODALS).map((item: IMenuItem) => (
            <ListItem button key={item.name} onClick={(): void => {this.openModal(item.modal || ""); }}>
              <ListItemText primary={item.name} />
            </ListItem>
          ))}
        </List>
      </div>
    );
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

        const burgerButtonMobile: JSX.Element = (
            <IconButton
                color="primary"
                aria-label="Open drawer"
                onClick={this.handleDrawOpen}
                edge="start"
                style={{float: "right", right: "10px", position: "absolute"}}
          >
            <MenuIcon />
          </IconButton>
        );

        return (
            <div>
                <AppBar position="static">
                    <Toolbar
                        style={{
                            background: "#fff",
                            height: "8vh",
                            minHeight: "60px",
                            maxHeight: "8vh",
                            display: "flex",
                            flexDirection: "row",
                        }}
                    >
                        <div style={{marginRight: "auto", marginLeft: "2%", display: "flex", flexDirection: "row"}} >
                            <Link to="/" onClick={this.handleMapLink}>
                                <div>
                                    <img
                                        src={logo}
                                        alt=""
                                        className="nav-logo"
                                    />

                                </div>
                            </Link>
                            <div style={{display: "flex", flexDirection: "column"}}>
                            <Typography color="primary" variant="h1">
                                RiverGuide
                            </Typography>
                            <ActivityFilter/>
                            </div>
                        </div>
                        <Hidden smDown>
                            {MODALS.map((item: IMenuItem) => (
                                 <Button
                                    key={item.name}
                                    color="primary"
                                    size="large"
                                    onClick={this.openModal.bind(this, item.modal || "")}
                                    style={{
                                        marginRight: "1em",
                                    }}
                                >
                                    {item.name}
                                </Button>
                            ))}
                            {isAuthenticated ? authButtons : noAuthButtons}
                        </Hidden>
                        <Hidden mdUp>
                            {burgerButtonMobile}
                        </Hidden>
                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="persistent"
                    anchor="right"
                    open={this.state.drawOpen}
                >
                {isAuthenticated ? this.getListAuthenticated() : this.getListNotAuthenticated()}
                </Drawer>
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
