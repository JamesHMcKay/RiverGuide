import { MuiThemeProvider } from "@material-ui/core/styles";
import jwt_decode from "jwt-decode";
import React, { Component } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { logoutUser, setCurrentUser } from "./actions/actions";
import "./App.css";
import store from "./store";
import setAuthToken from "./utils/setAuthToken";

import NavBar from "./components/NavBar";
import Panel from "./components/Panel";
import ProfileContainer from "./components/profile/ProfileContainer";
import Modals from "./components/utils/Modals";

import theme from "./utils/theme";

// Check for token
if (localStorage.jwtToken) {
    // Set auth token header auth
    setAuthToken(localStorage.jwtToken);
    // Decode token and get user info and exp
    const decoded: any = jwt_decode(localStorage.jwtToken);
    // Set user and isAuthenticated
    store.dispatch(setCurrentUser(decoded));

    // Check for expired token
    const currentTime: number = Date.now() / 1000;
    // TODO reinstate this
    // if (decoded.exp < currentTime) {
    //     // Logout user
    //     store.dispatch(logoutUser());
    //     // TODO: Clear current profile state
    //     // Redirect to login
    //     window.location.href = "/";
    // }
}

class App extends Component {
    public render(): JSX.Element {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <MuiThemeProvider theme={theme}>
                        <div className="App">
                            <NavBar />
                            <Switch>
                                <Route exact path="/" component={Panel} />
                                <Route
                                    path="/profile"
                                    component={ProfileContainer}
                                />
                            </Switch>
                            <Modals />
                        </div>
                    </MuiThemeProvider>
                </BrowserRouter>
            </Provider>
        );
    }
}

export default App;
