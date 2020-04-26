import React from 'react'
import {useDispatch, useSelector} from "react-redux";
import { jsx } from '@emotion/core'
import {
    MenuList,
    MenuItem,
    List, ListItem,
    IconHome,
    IconSettings, Divider, IconPlus, IconUser, Input, IconSearch,
} from 'sancho'
import NoteList from "./NoteList";
import {RootState} from "../store";
import {Link, useLocation, useNavigate} from "@reach/router";
import { createNote } from "../store/notes/thunks";


/** @jsx jsx */
function SidebarMenu(): JSX.Element {
    const location = useLocation()
    const navigate = useNavigate()
    const notes = useSelector((state: RootState) => state.notes.notes);
    const dispatch = useDispatch();

    function handleNewNote() {
        dispatch(createNote( location.pathname, navigate))
    }

    return (
        <div tabIndex={0} >
            <MenuList >
                <Link css={{ textDecoration: 'none' }} to={'/'}>
                    <MenuItem contentBefore={<IconHome />}>
                        Home
                    </MenuItem>
                </Link>
                <Link css={{ textDecoration: 'none' }} to={'/settings'}>
                    <MenuItem contentBefore={<IconSettings />} >
                        Settings
                    </MenuItem>
                </Link>
                <MenuItem contentBefore={<IconUser />} >
                    Profile
                </MenuItem>
            </MenuList>
            <Divider />
            <List>
                <ListItem
                    contentBefore={<IconPlus/>}
                    onClick={handleNewNote}
                    primary={'New'}
                /> {/* TODO: Implement Full text search https://firebase.google.com/docs/firestore/solutions/search
                <ListItem
                    primary={<Input
                        placeholder={'Search...'}
                    />}
                    contentAfter={<IconSearch/>}
                    interactive={false}
                /> */}
            </List>

            <NoteList list={notes} />
            {/* <SearchResults results={results} />*/}
        </div>

    )
}

export default SidebarMenu
