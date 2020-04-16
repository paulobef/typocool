import {Note} from "../notes/types";
import { EditorState } from 'draft-js'

export const LOAD_NOTE = 'app/editor/load';
export const UPDATE_LOADED_NOTE = 'app/editor/update'

interface loadNoteAction {
    type: typeof LOAD_NOTE
    payload: Note
}

interface updateLoadedNoteAction {
    type: typeof UPDATE_LOADED_NOTE
    payload: {id: string, title: string, editorState: EditorState}
}

export interface LoadedNoteState {
    id: string
    title: string
    editorState: EditorState
}

export type EditorActionTypes = loadNoteAction | updateLoadedNoteAction
