import { MuiThemeProvider } from "@material-ui/core/styles";
import jwt_decode from "jwt-decode";
import React, { Component } from "react";
import ReactGA from "react-ga";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { addToRecents } from "./actions/actions";
import { logoutUser, setCurrentUser } from "./actions/getAuth";
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
import axios from "axios";
import * as darksky from "dark-sky-api";
import * as weather from "openweather-apis";
import { ACTIVITY_MENU } from "./components/ActivityFilter";
import { categories, ITabCategory } from "./components/ControlBar";
import Help, { helpPages, IHelpPages } from "./components/Help";
import BottomNav from "./components/leftPanel/BottomNav";
import { IUser } from "./utils/types";

// Create redux store with history
const history: any = createHistory();
const store: any = configureStore({}, history);

axios.defaults.timeout = 30000;

ReactGA.initialize("UA-144174370-1");

// Check for token
if (localStorage.jwtToken) {
    // Set auth token header auth
    // Decode token and get user info and exp
    const decoded: any = jwt_decode(localStorage.jwtToken);
    // Set user and isAuthenticated
    if (localStorage.user) {
        const user: IUser = JSON.parse(localStorage.user);
        store.dispatch(setCurrentUser(user));
        ReactGA.set({userId: user.id});
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

if (localStorage.recentItems) {
    store.dispatch(addToRecents(JSON.parse(localStorage.recentItems)));
}

ReactGA.pageview(window.location.pathname + window.location.search);

weather.setAPPID("521cea2fce8675d0fe0678216dc01d5c");
weather.setLang("en");

darksky.units = "si";
darksky.apiKey = "ab0e334c507c7f0de8fde5e61f27d6df";

const tabIds: string[] = categories.filter(
    (item: ITabCategory) => item.id !== "trips").map((item: ITabCategory) => `${item.route}*`,
);

const routes: string[] = ACTIVITY_MENU.map((item: {name: string, id: string}) =>
    `/${item.id}*`,
).concat(tabIds);

class App extends Component {
    public render(): JSX.Element {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <MuiThemeProvider theme={theme}>
                    <div className="App">
                            <NavBar/>
                            <Switch>
                                <Route
                                    exact
                                    path={routes.concat(["/", "/trips*"])}
                                    component={TabBar}
                                />
                            </Switch>
                            <Switch>
                                <Route
                                    exact
                                    path={routes.concat("/")}
                                    component={Panel}
                                />
                                <Route
                                    path="/trips"
                                    component={ProfileContainer}
                                />
                                <Route
                                    path="/profile"
                                    component={ProfilePage}
                                />
                                <Route exact path="/connect/:provider" component={ConnectPage} />
                                <Route
                                    exact
                                    path={helpPages.map((item: IHelpPages) => item.route)}
                                    component={Help}

                                />
                            </Switch>
                            <Hidden mdUp>
                                <Switch>
                                        <Route
                                            exact
                                            path={routes.concat(["/", "/trips"])}
                                            component={BottomNav}
                                        />
                                </Switch>
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
