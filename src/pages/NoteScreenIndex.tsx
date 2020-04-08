import React from 'react'
import { jsx } from '@emotion/core'
import {Button, IconButton, IconPlus, Text} from "sancho";
import {useDispatch} from "react-redux";

import {useNavigate} from "@reach/router"
import {createAndOpenNewNote} from "../store/notes/helpers";
import {useLastNoteId} from "../store/notes/hooks";
import {NoteScreenProps} from "./NoteScreen";



/** @jsx jsx */
function NoteScreenIndex(props: NoteScreenProps): JSX.Element {
    const dispatch = useDispatch();
    const navigate = useNavigate()
    const lastNoteId = useLastNoteId();
    function handleNewNote(): void {
        const id = lastNoteId + 1
        createAndOpenNewNote(id,'notes/' + id, { dispatch, navigate })
    }

    return (
        <div css={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

            <img src={'drawkit-notebook-man-monochrome.svg'} alt={'notebook'} height={500} width={500}/>
            <Text variant="h4">Welcome to <strong>Typocool:</strong></Text>
            <Text variant="lead"> Stay cool & focused with a minimalist notepad</Text>
            <Button
                variant="ghost"
                size={'lg'}
                onClick={handleNewNote}
            >Get started</Button>
        </div>
    )
}

export default NoteScreenIndex
