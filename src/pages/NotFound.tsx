import React from 'react'
import { jsx } from '@emotion/core'
import {Button, Text} from "sancho";
import {useDispatch, useSelector} from "react-redux";
import {useLocation, useNavigate} from "@reach/router"
import {NoteScreenProps} from "./Note";
import {RootState} from "../store";
import {createNote} from "../store/notes/thunks";



/** @jsx jsx */
function NotFound(props: NoteScreenProps): JSX.Element {
    const location = useLocation()
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userFirstName = useSelector((state: RootState) => state.user.user.firstName)

    function handleNewNote() {
        dispatch(createNote( location.pathname ,navigate))
    }

    return (
        <div css={{ display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <img src={'/error-404-monochrome.svg'} alt={'notebook'} height={400} width={400} css={{ marginBottom: 100, marginTop: 100}}/>
            <Text variant="h4">It must be up there somewhere, let me take another look...</Text>
            <Text variant="lead">Sorry {userFirstName}, it looks like we couldn't find the note you were looking for.</Text>
            <Button
                css={{ marginTop: 20}}
                variant="ghost"
                size={'lg'}
                onClick={handleNewNote}
            > No worries, I'll write a new one</Button>
        </div>
    )
}

export default NotFound
