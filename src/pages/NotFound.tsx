import React from 'react'
import { jsx } from '@emotion/core'
import {Button, Text} from "sancho";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate} from "@reach/router"
import {NoteScreenProps} from "./NoteScreen";
import {RootState} from "../store";
import {createNote} from "../store/notes/thunks";



/** @jsx jsx */
function NotFound(props: NoteScreenProps): JSX.Element {
    const location = useLocation()
    const dispatch = useDispatch();
    const navigate = useNavigate();

    function handleNewNote() {
        dispatch(createNote( location.pathname ,navigate))
    }

    return (
        <div css={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <img src={'/error-404-monochrome.svg'} alt={'notebook'} height={400} width={400} css={{ marginBottom: 100, marginTop: 100}}/>
            <Text variant="h4">Is it a bird? is it a plane? No, it's just that we didn't found the note you were looking for.</Text>
            <Text variant="lead"> Do you want to create a new note?</Text>
            <Button
                css={{ marginTop: 20}}
                variant="ghost"
                size={'lg'}
                onClick={handleNewNote}
            > Sure, why not?</Button>
        </div>
    )
}

export default NotFound
