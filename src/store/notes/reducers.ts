import {LOAD_NOTES, Note, NoteActionTypes, NoteState} from "./types";


function loadNote(state: NoteState, payload: Note[]): NoteState {
    return Object.freeze(Object.assign({}, state, { notes: payload }))
}

const initialState: NoteState = Object.freeze({
    notes: [],
});


export default function notes(state = initialState, action: NoteActionTypes): NoteState {
    switch (action.type) {
        case LOAD_NOTES: return loadNote(state, action.payload)
        default:
            return state
    }
}


