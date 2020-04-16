import React from 'react'
import { jsx } from '@emotion/core'
import {Button, Text} from "sancho";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate} from "@reach/router"
import {NoteScreenProps} from "./NoteScreen";
import {RootState} from "../store";
import {createNote} from "../store/notes/thunks";



/** @jsx jsx */
function NoteIndex(props: NoteScreenProps): JSX.Element {
    const location = useLocation()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userFirstName = useSelector((state: RootState) => state.user.firstName);

    function handleNewNote() {
        // we navigate inside the thunk because outside we don't have access to the user.uid
        dispatch(createNote( location.pathname ,navigate))
    }

    return (
        <div css={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

            <img src={'drawkit-notebook-man-monochrome.svg'} alt={'notebook'} height={500} width={500}/>
            <Text variant="h4">Welcome to <strong>Typocool</strong>, {userFirstName}</Text>
            <Text variant="lead"> Stay cool & focused with your minimalist notepad</Text>
            <Button
                css={{ marginTop: 20}}
                variant="ghost"
                size={'lg'}
                onClick={handleNewNote}
            >Write a note</Button>
        </div>
    )
}

export default NoteIndex
