import {LOAD_NOTE, EditorActionTypes, UPDATE_LOADED_NOTE, LOAD_ERROR, LoadedNoteState} from "./types";
import {Note} from "../notes/types";
import { EditorState } from 'draft-js'

export function loadNoteInEditor(payload: Note): EditorActionTypes {
    return {
        type: LOAD_NOTE,
        payload
    }
}

export function loadError(): EditorActionTypes {
    return {
        type: LOAD_ERROR
    }
}

export function updateLoadedNote(payload: LoadedNoteState): EditorActionTypes {
    return {
        type: UPDATE_LOADED_NOTE,
        payload
    }
}
