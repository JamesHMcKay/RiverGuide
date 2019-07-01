import { MuiThemeProvider } from "@material-ui/core/styles";
import jwt_decode from "jwt-decode";
import React, { Component } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { getUserDetails, logoutUser, setCurrentUser } from "./actions/getAuth";
import "./App.css";
import configureStore from "./store";
import setAuthToken from "./utils/setAuthToken";

import "mapbox-gl/dist/mapbox-gl.css";
import NavBar from "./components/NavBar";
import Panel from "./components/Panel";
import ProfileContainer from "./components/profile/ProfileContainer";
import ProfilePage from "./components/profile/ProfilePage";
import Modals from "./components/utils/Modals";

import createHistory from "history/createBrowserHistory";
import ConnectPage from "./components/connect/Connect";

import TabBar from "./components/TabBar";
import theme from "./utils/theme";

import Hidden from "@material-ui/core/Hidden";
import * as darksky from "dark-sky-api";
import * as weather from "openweather-apis";
import BottomNav from "./components/leftPanel/BottomNav";
import ToggleList from "./components/leftPanel/ToggleList";
import { IUser } from "./utils/types";

// Create redux store with history
const history: any = createHistory();
const store: any = configureStore({}, history);

// Check for token
if (localStorage.jwtToken) {
    // Set auth token header auth
    // Decode token and get user info and exp
    const decoded: any = jwt_decode(localStorage.jwtToken);
    // Set user and isAuthenticated
    if (localStorage.user) {
        const user: IUser = JSON.parse(localStorage.user);
        store.dispatch(setCurrentUser(user));
        store.dispatch(getUserDetails(user.id));
        setAuthToken(localStorage.jwtToken);
    }

    // Check for expired token
    const currentTime: number = Date.now() / 1000;
    // TODO reinstate this
    if (decoded.exp < currentTime) {
        // Logout user
        store.dispatch(logoutUser());
        // TODO: Clear current profile state
        // Redirect to login
        window.location.href = "/";
    }
}

weather.setAPPID("521cea2fce8675d0fe0678216dc01d5c");
weather.setLang("en");

darksky.units = "si";
darksky.apiKey = "ab0e334c507c7f0de8fde5e61f27d6df";

class App extends Component {
    public render(): JSX.Element {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <MuiThemeProvider theme={theme}>
                    <div className="App">
                            <NavBar/>
                            <Route component={TabBar} />
                            <Switch>
                                <Route
                                    exact
                                    path={["/activities", "/data", "/"]}
                                    component={Panel}
                                />
                                <Route
                                    path="/logbook"
                                    component={ProfileContainer}
                                />
                                <Route
                                    path="/profile"
                                    component={ProfilePage}
                                />
                                <Route exact path="/connect/:provider" component={ConnectPage} />
                            </Switch>
                            <Hidden mdUp>
                                <ToggleList/>
                                <Route component={BottomNav} />
                            </Hidden>
                            <Modals />
                        </div>
                    </MuiThemeProvider>
                </BrowserRouter>
            </Provider>
        );
    }
}

export default App;
