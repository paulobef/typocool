import React from "react";
import "./App.css";
import SidebarLayout from "./views/components/SidebarLayout";
import Note from "./views/pages/Note";
import SidebarMenu from "./views/containers/SidebarMenu";
import { Router } from "@reach/router";
import NoteIndex from "./views/pages/NoteIndex";
import { RootState } from "./store";
import { useSelector } from "react-redux";
import Login from "./views/pages/Login";
import NotFound from "./views/pages/NotFound";
import Settings from "./views/pages/Settings";
import Profile from "./views/pages/Profile";

function App() {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  console.log(isAuthenticated);
  if (isAuthenticated) {
    return (
      <SidebarLayout
        path={"/notes"}
        mainScreenComponent={
          <Router>
            <NotFound default />
            <Note path={"notes/:noteId"} />
            <NoteIndex path={"/"} />
            <Settings path={"/settings"} />
            <Profile path={"/profile"} />
          </Router>
        }
        sidebarComponent={<SidebarMenu />}
        initialSidebarWidth={200}
        resizable={true}
      />
    );
  } else {
    return <Login />;
  }
}

export default App;
