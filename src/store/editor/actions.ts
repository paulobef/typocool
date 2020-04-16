import {LOAD_NOTE, EditorActionTypes, UPDATE_LOADED_NOTE} from "./types";
import {Note} from "../notes/types";
import { EditorState } from 'draft-js'

export function loadNoteInEditor(payload: Note): EditorActionTypes {
    return {
        type: LOAD_NOTE,
        payload
    }
}
export function updateLoadedNote(payload: { id: string; title: string; editorState: EditorState }): EditorActionTypes {
    return {
        type: UPDATE_LOADED_NOTE,
        payload
    }
}
