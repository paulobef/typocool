import React from 'react'
import { jsx } from '@emotion/core'
import {Button, Text} from "sancho";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "@reach/router"
import {NoteScreenProps} from "./NoteScreen";
import {RootState} from "../store";
import {createNote} from "../store/notes/thunks";



/** @jsx jsx */
function NoteIndex(props: NoteScreenProps): JSX.Element {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userFirstName = useSelector((state: RootState) => state.user.firstName);
    function handleNewNote() {
        dispatch(createNote(navigate))
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
            >Get started</Button>
        </div>
    )
}

export default NoteIndex
