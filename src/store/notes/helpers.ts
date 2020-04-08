import {addNote, deleteNote} from "./actions";
import {convertToRaw, EditorState} from "draft-js";
import {Note} from "./types";
import {Dispatch} from "redux";
import {NavigateFn} from "@reach/router";

interface StoreHelperConfigProps {
    dispatch: Dispatch
    navigate: NavigateFn
}

export function createAndOpenNewNote(id: number, location: string, { dispatch, navigate }: StoreHelperConfigProps ) {
    const note = {
        id: id,
        title: '',
        content: EditorState.createEmpty().getCurrentContent()
    }
    dispatch(addNote(note));
    navigate(location)
}

export function  deleteNoteAndNavigate(id: number, location: string, { dispatch, navigate }: StoreHelperConfigProps) {
    dispatch(deleteNote({ id }));
    navigate(location)
}


