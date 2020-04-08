import React, {useRef, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import { jsx } from '@emotion/core'
import {
    MenuList,
    MenuItem,
    IconHome,
    IconSettings, Divider, IconPlus, IconSave, IconUser
} from 'sancho'
import NoteList from "./NoteList";
import {RootState} from "../store";
import {Link, navigate, useLocation, useNavigate} from "@reach/router";
import {createAndOpenNewNote, deleteNoteAndNavigate} from "../store/notes/helpers";
import {useLastNoteId} from "../store/notes/hooks";


/** @jsx jsx */
function MainMenu(): JSX.Element {
    const location = useLocation()
    const navigate = useNavigate()
    const notes = useSelector((state: RootState) => state.notes.notes);
    const dispatch = useDispatch();
    const lastNoteId = useLastNoteId();
    function handleNewNote() {
         const id = lastNoteId + 1;
        createAndOpenNewNote( id, location.pathname.includes('notes') ? id.toString() : `notes/${id}`,{ dispatch, navigate })
    }

    return (
        <div tabIndex={0} >
            <MenuList >
                <Link css={{ textDecoration: 'none' }}to={'/'}>
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
