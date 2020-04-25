import {
    EditorActionTypes,
    LOAD_NOTE,
    LoadedNote,
    UPDATE_LOADED_NOTE, LoadedNoteState, START_LOADING_NOTE, ERROR_LOADING_NOTE
} from "./types";
import {Note} from "../notes/types";
import { EditorState } from "draft-js";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
// @ts-ignore
import isYesterday from "dayjs/plugin/isYesterday";
// @ts-ignore
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(isToday)
dayjs.extend(isYesterday)
dayjs.extend(relativeTime)


function loadNote(state: LoadedNoteState, payload: Note): LoadedNoteState {
    return Object.freeze(Object.assign({}, state, {
        editor: {
            id: payload.id,
            title: payload.title,
            lastSaved: payload.lastSaved,
            editorState: EditorState.createWithContent(payload.content),
        },
        status: { loadError: false, isLoading: false }
    }))
}

function startLoading(state: LoadedNoteState): LoadedNoteState {
    return Object.freeze(Object.assign({}, state, {
        status: { loadError: false, isLoading: true }
    }))
}

function loadError(state: LoadedNoteState): LoadedNoteState {
    return Object.freeze(Object.assign({}, state, {
        status: { loadError: true, isLoading: false }
    }))
}

function updateLoadedNote(state: LoadedNoteState, payload: LoadedNote): LoadedNoteState {
    return Object.freeze(Object.assign({}, state, {
        editor: {
            id: payload.id,
            title: payload.title,
            lastSaved: payload.lastSaved,
            editorState: payload.editorState
        }
    }))
}


const initialState: LoadedNoteState = {
    editor: {
        id: '',
        title: '',
        lastSaved: dayjs(),
        editorState: EditorState.createEmpty(),
    },
    status: {
        loadError: false,
        isLoading: false
    }

};


export default function editor(state = initialState, action: EditorActionTypes): LoadedNoteState {
    switch (action.type) {
        case LOAD_NOTE: return loadNote(state, action.payload);
        case UPDATE_LOADED_NOTE: return updateLoadedNote(state, action.payload);
        case ERROR_LOADING_NOTE: return loadError(state);
        case START_LOADING_NOTE: return startLoading(state)
        default:
            return state
    }
}
