import {
    ADD_NOTE,
    DELETE_NOTE,
    //LOAD_NOTE,
    Note,
    NoteActionTypes,
    //UPDATE_EDITOR_STATE,
    //UPDATE_EDITOR_TITLE,
    UPDATE_NOTE
} from './types'
//import {EditorState} from "draft-js";


export function addNote(payload: Note): NoteActionTypes {
    return {
        type: ADD_NOTE,
        payload
    }
}

export function updateNote(payload: Note): NoteActionTypes {
    return {
        type: UPDATE_NOTE,
        payload
    }
}

export function deleteNote(payload: {id: number}): NoteActionTypes {
    return {
        type: DELETE_NOTE,
        payload
    }
}
/*
export function loadNote(payload: NoteEditor): NoteActionTypes {
    return {
        type: LOAD_NOTE,
        payload
    }
}

export function updateEditorState(payload: EditorState): NoteActionTypes {
    return {
        type: UPDATE_EDITOR_STATE,
        payload
    }
}

export function updateEditorTitle(payload: string | null): NoteActionTypes {
    return {
        type: UPDATE_EDITOR_TITLE,
        payload
    }
}
*/
