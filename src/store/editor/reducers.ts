import {EditorActionTypes, LOAD_ERROR, LOAD_NOTE, LoadedNoteState, UPDATE_LOADED_NOTE} from "./types";
import {Note} from "../notes/types";
import { EditorState } from "draft-js";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
// @ts-ignore
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(isToday)
dayjs.extend(isYesterday)
dayjs.extend(relativeTime)


function loadNote(state: LoadedNoteState, payload: Note): LoadedNoteState {
    return Object.freeze(Object.assign({}, state, {
        id: payload.id,
        title: payload.title,
        lastSaved: payload.lastSaved,
        editorState: EditorState.createWithContent(payload.content),
        loadError: false
    }))
}

function loadError(state: LoadedNoteState): LoadedNoteState {
    return Object.freeze(Object.assign({}, state, {
        loadError: true
    }))
}

function updateLoadedNote(state: LoadedNoteState, payload: LoadedNoteState): LoadedNoteState {
    return Object.freeze(Object.assign({}, state, {
        id: payload.id,
        title: payload.title,
        lastSaved: payload.lastSaved,
        editorState: payload.editorState
    }))
}


const initialState: LoadedNoteState = {
    id: '',
    title: '',
    lastSaved: dayjs(),
    editorState: EditorState.createEmpty(),
    loadError: false
};


export default function editor(state = initialState, action: EditorActionTypes): LoadedNoteState {
    switch (action.type) {
        case LOAD_NOTE: return loadNote(state, action.payload);
        case UPDATE_LOADED_NOTE: return updateLoadedNote(state, action.payload);
        case LOAD_ERROR: return loadError(state);
        default:
            return state
    }
}
