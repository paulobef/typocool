import React from 'react';
import './App.css';
import {createHistory, LocationProvider, Router} from "@reach/router";
import {Provider} from "react-redux";
import App from "./App";
import configureStore from "./store";
import { jsx } from '@emotion/core'

const store = configureStore()


/** @jsx jsx */
function Root() {
    // @ts-ignore
    let history = createHistory(window)
    return (
        <React.StrictMode>
            <Provider store={store}>
                <LocationProvider history={history}>
                    <App />
                </LocationProvider>
            </Provider>
        </React.StrictMode>
    );
}

export default Root;
