import {
    LOAD_NOTE,
    EditorActionTypes,
    UPDATE_LOADED_NOTE,
    LoadedNote,
    ERROR_LOADING_NOTE,
    START_LOADING_NOTE
} from "./types";
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
        type: ERROR_LOADING_NOTE
    }
}

export function startLoading(): EditorActionTypes {
    return {
        type: START_LOADING_NOTE
    }
}

export function updateLoadedNote(payload: LoadedNote): EditorActionTypes {
    return {
        type: UPDATE_LOADED_NOTE,
        payload
    }
}
