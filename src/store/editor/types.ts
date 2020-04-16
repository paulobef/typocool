import {Note} from "../notes/types";
import { EditorState } from 'draft-js'
import {Dayjs} from 'dayjs'

export const LOAD_NOTE = 'app/editor/load';
export const LOAD_ERROR = 'app/editor/error';
export const UPDATE_LOADED_NOTE = 'app/editor/update';

interface loadNoteAction {
    type: typeof LOAD_NOTE
    payload: Note
}

interface loadErrorAction {
    type: typeof LOAD_ERROR
}

interface updateLoadedNoteAction {
    type: typeof UPDATE_LOADED_NOTE
    payload: LoadedNoteState
}

export interface LoadedNoteState {
    id: string
    title: string
    lastSaved: Dayjs
    editorState: EditorState
    loadError?: boolean
}

export type EditorActionTypes = loadNoteAction | updateLoadedNoteAction | loadErrorAction
