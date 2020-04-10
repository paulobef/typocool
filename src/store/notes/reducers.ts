import {
    UPDATE_NOTE,
    ADD_NOTE,
    DELETE_NOTE,
    NoteActionTypes,
    Note,
    NoteState,
    //UPDATE_EDITOR_STATE,
    //UPDATE_EDITOR_TITLE, LOAD_NOTE
} from "./types";
//import { EditorState } from 'draft-js'



function addNote(state: NoteState, payload: Note): NoteState {
    const newNotes = state.notes.concat([payload]);
        return Object.freeze(Object.assign({}, state, { notes: newNotes }))
}

function updateNote(state: NoteState, { id, title, content }: Note): NoteState {
    const newNotes = state.notes.map((note: Note) => {
        if (note.id === id) {
            return Object.assign({}, note, { title, content })
        }
        return note
    });
    return Object.freeze(Object.assign({}, state, { notes: newNotes }))
}

function deleteNote(state: NoteState, { id }: { id: number }): NoteState  {
   const newNotes = state.notes.filter((note: Note) => {
        return note.id !== id
    })
    return Object.freeze(Object.assign({}, state, { notes: newNotes }))
}

/*
function updateEditorState(state: NoteState, payload: EditorState): NoteState {
    const newEditor = Object.assign({}, state.editor, { editorState: payload})
    return Object.freeze(Object.assign({}, state, { editor: newEditor }))
}

function updateEditorTitle(state: NoteState, payload: string | null ): NoteState {
    const newEditor = Object.assign({}, state.editor, { title: payload})
    return Object.freeze(Object.assign({}, state, { editor: newEditor }))
}

function loadNote(state: NoteState, payload: NoteEditor): NoteState {
    const newEditor = Object.assign({}, state.editor, { id: payload.id ,title: payload.title, editorState: EditorState.createWithContent(payload.content)})
    return Object.freeze(Object.assign({}, state, { editor: newEditor }))
}*/

const initialState: NoteState = Object.freeze({
    notes: [],
   /* editor: {
        id: null,
        title: '',
        editorState: EditorState.createEmpty()
    } */
});


export default function notes(state = initialState, action: NoteActionTypes): NoteState {
    switch (action.type) {
        case ADD_NOTE: return addNote(state, action.payload);
        case UPDATE_NOTE: return updateNote(state, action.payload);
        case DELETE_NOTE: return deleteNote(state, action.payload);
        //case UPDATE_EDITOR_TITLE: return updateEditorTitle(state, action.payload)
        //case UPDATE_EDITOR_STATE: return updateEditorState(state, action.payload)
        //case LOAD_NOTE: return loadNote(state, action.payload)
        default:
            return state
    }
}


