import React from 'react'
import {useDispatch, useSelector} from "react-redux";
import { jsx } from '@emotion/core'
import {
    MenuList,
    MenuItem,
    IconHome,
    IconSettings, Divider, IconPlus, IconUser,
} from 'sancho'
import NoteList from "./NoteList";
import {RootState} from "../store";
import {Link, useNavigate} from "@reach/router";
import {createNote} from "../store/notes/thunks";


/** @jsx jsx */
function MainMenu(): JSX.Element {
    const navigate = useNavigate()
    const notes = useSelector((state: RootState) => state.notes.notes);
    const dispatch = useDispatch();

    function handleNewNote() {
        dispatch(createNote(navigate))
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
            <MenuList>
                <MenuItem
                    contentBefore={<IconPlus/>}
                    onClick={handleNewNote}
                >
                    New
                </MenuItem>
            </MenuList>

            <NoteList list={notes} />
        </div>

    )
}

export default MainMenu
