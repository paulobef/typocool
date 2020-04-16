import React from 'react'
import {useDispatch, useSelector} from "react-redux";
import { jsx } from '@emotion/core'
import {
    MenuList,
    MenuItem,
    List, ListItem,
    IconHome,
    IconSettings, Divider, IconPlus, IconUser,
} from 'sancho'
import NoteList from "./NoteList";
import {RootState} from "../store";
import {Link, useLocation, useNavigate} from "@reach/router";
import { createNote } from "../store/notes/thunks";


/** @jsx jsx */
function MainMenu(): JSX.Element {
    const location = useLocation()
    const navigate = useNavigate()
    const notes = useSelector((state: RootState) => state.notes.notes);
    const dispatch = useDispatch();

    function handleNewNote() {
        dispatch(createNote( location.pathname ,navigate))
    }

    return (
        <div tabIndex={0} >
            <MenuList >
                <Link css={{ textDecoration: 'none' }} to={'/'}>
                    <MenuItem contentBefore={<IconHome />}>
                        Home
                    </MenuItem>
                </Link>
                <MenuItem contentBefore={<IconSettings />} component="a" href="#">
                    Settings
                </MenuItem>
                <MenuItem contentBefore={<IconUser />} component="a" href="#">
                    Profile
                </MenuItem>
            </MenuList>
            <Divider />
            <List>
                <ListItem
                    contentAfter={<IconPlus/>}
                    onClick={handleNewNote}
                    primary={'Create'}
                    //secondary={'Add new note'}
                />
            </List>

            <NoteList list={notes} />
        </div>

    )
}

export default MainMenu
