import {EditorState, ContentState} from "draft-js";

export const ADD_NOTE = 'app/notes/note/add';
export const UPDATE_NOTE = 'app/notes/note/update';
export const DELETE_NOTE = 'app/notes/note/delete';
//export const UPDATE_EDITOR_STATE = 'app/notes/editor/editor_state/update';
//export const UPDATE_EDITOR_TITLE = 'app/notes/editor/title/update';
//export const LOAD_NOTE = 'app/notes/editor/load';


// STATE TYPES
export type Note = {
    id: number
    title: string | null,
    content: ContentState
}

export type NoteState = {
    notes: Note[]
   // editor: { id: number | null, title: string | null, editorState: EditorState }
}

// ACTION TYPES
interface AddNoteAction {
    type: typeof ADD_NOTE
    payload: Note
}

interface UpdateNoteAction {
    type: typeof UPDATE_NOTE
    payload: Note
}

interface DeleteNoteAction {
    type: typeof DELETE_NOTE
    payload: {id : number}
}

/*
interface loadNoteAction {
    type: typeof LOAD_NOTE
    payload: NoteEditor
}

interface updateEditorStateAction {
    type: typeof UPDATE_EDITOR_STATE
    payload: EditorState
}

interface updateEditorTitleAction {
    type: typeof UPDATE_EDITOR_TITLE
    payload: string | null
}*/



export type NoteActionTypes = AddNoteAction | UpdateNoteAction | DeleteNoteAction //| loadNoteAction | updateEditorTitleAction | updateEditorStateAction
