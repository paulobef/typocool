import React, {useState, Fragment, useEffect} from 'react';
import './App.css';
import SidebarLayout from "./components/SidebarLayout";
import NoteScreen from "./pages/NoteScreen";
import MainMenu from "./components/MainMenu";
import { Router} from "@reach/router";
import NoteIndex from "./pages/NoteIndex";
import {RootState} from "./store";
import {useSelector} from "react-redux";
import SignInOrUp from "./pages/SignInOrUp";
import NotFound from "./pages/NotFound";


function App () {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
    console.log(isAuthenticated)
    if (isAuthenticated) {
        return (
                <SidebarLayout
                    path={'/notes'}
                    mainScreenComponent={
                        <Router>
                            <NotFound default />
                            <NoteScreen path={'notes/:noteId'}/>
                            <NoteIndex path={'/'}/>
                        </Router>
                    }
                    sidebarComponent={<MainMenu />}
                    initialSidebarWidth={200}
                    resizable={true}
                />
        )
    } else {
        return <SignInOrUp />
    }


}

export default App;
