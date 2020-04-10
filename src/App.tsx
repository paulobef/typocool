import React, {useState, Fragment, useEffect} from 'react';
import './App.css';
import SidebarLayout from "./components/SidebarLayout";
import NoteEditor from "./pages/NoteEditor";
import MainMenu from "./components/MainMenu";
import {Redirect, Router} from "@reach/router";
import NoteIndex from "./pages/NoteIndex";
import {RootState} from "./store";
import {useSelector} from "react-redux";
import Login from "./pages/Login";




function App () {
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated)
   // const [authenticated, setIsAuthenticated] = useState(isAuthenticated)

   /* useEffect(() => {
        setIsAuthenticated(isAuthenticated)
    }, [isAuthenticated]) */


    console.log(isAuthenticated)
    if (isAuthenticated) {
        return (
            <SidebarLayout
                path={'*'}
                mainScreenComponent={
                    <Router>
                        <NoteEditor path={'notes/:noteId'}/>
                        <NoteIndex path={'/'}/>
                    </Router>
                }
                sidebarComponent={<MainMenu />}
                initialSidebarWidth={200}
                resizable={true}
            />
        )
    } else {
        return <Login />
    }


}

export default App;
