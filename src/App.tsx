import React from 'react';
import './App.css';
import SidebarLayout from "./components/SidebarLayout";
import Note from "./pages/Note";
import SidebarMenu from "./components/SidebarMenu";
import { Router} from "@reach/router";
import NoteIndex from "./pages/NoteIndex";
import {RootState} from "./store";
import {useSelector} from "react-redux";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";


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
                            <Note path={'notes/:noteId'}/>
                            <NoteIndex path={'/'}/>
                            <Settings path={'/settings'}/>
                            <Profile path={'/profile'}/>
                        </Router>
                    }
                    sidebarComponent={<SidebarMenu />}
                    initialSidebarWidth={200}
                    resizable={true}
                />
        )
    } else {
        return <Login />
    }


}

export default App;
