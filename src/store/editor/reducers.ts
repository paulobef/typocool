import {EditorActionTypes, LOAD_NOTE, LoadedNoteState, UPDATE_LOADED_NOTE} from "./types";
import {Note} from "../notes/types";
import { EditorState } from "draft-js";


function loadNote(state: LoadedNoteState, payload: Note): LoadedNoteState {
    return Object.freeze(Object.assign({}, state, {
        title: payload.title,
        editorState: EditorState.createWithContent(payload.content)
    }))
}

function updateLoadedNote(state: LoadedNoteState, payload: { title: string, editorState: EditorState }): LoadedNoteState {
    return Object.freeze(Object.assign({}, state, {
        title: payload.title,
        editorState: payload.editorState
    }))
}


const initialState: LoadedNoteState = Object.create(null);


export default function editor(state = initialState, action: EditorActionTypes): LoadedNoteState {
    switch (action.type) {
        case LOAD_NOTE: return loadNote(state, action.payload);
        case UPDATE_LOADED_NOTE: return updateLoadedNote(state, action.payload);
        default:
            return state
    }
}