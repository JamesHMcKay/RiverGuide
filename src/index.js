import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import Div100vh from "react-div-100vh";
// import * as serviceWorker from "./serviceWorker";
import "bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/font-awesome/css/font-awesome.min.css";
import { unregister } from './serviceWorker';

unregister();

ReactDOM.render(<Div100vh><App /></Div100vh>, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
// serviceWorker.register();
