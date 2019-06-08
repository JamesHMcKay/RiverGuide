import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import { routerMiddleware } from 'react-router-redux';
import rootReducer from "./reducers";

export default function configureStore(initialState = {}, history) {
    const middlewares = [
        thunk,
        routerMiddleware(history),
      ];

    const composeSetup =
    process.env.NODE_ENV !== "production" &&
    typeof window === "object" &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        : compose;

    const store = createStore(
    rootReducer,
    initialState,
    composeSetup(applyMiddleware(...middlewares)),
    );

    return store;
}

