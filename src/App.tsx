import React, { useState, Fragment } from 'react';
import './App.css';
import SidebarLayout from "./components/SidebarLayout";
import { jsx } from '@emotion/core'
import NoteScreen from "./pages/NoteScreen";
import MainMenu from "./components/MainMenu";
import {createHistory, LocationProvider, Router} from "@reach/router";
import NoteScreenIndex from "./pages/NoteScreenIndex";

/** @jsx jsx */
function App() {
    // @ts-ignore
    let history = createHistory(window)
    return (
        <LocationProvider history={history}>
        <SidebarLayout
            mainScreenComponent={
                <Router>
                    <NoteScreen path={'notes/:noteId'}/>
                    <NoteScreenIndex path={'/'}/>
                 </Router>
                }
            sidebarComponent={<MainMenu />}
            initialSidebarWidth={200}
            resizable={true}
        />
        </LocationProvider>
  );
}

export default App;
