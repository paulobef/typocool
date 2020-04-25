import {Note} from "../notes/types";
import { EditorState } from 'draft-js'
import {Dayjs} from 'dayjs'

export const LOAD_NOTE = 'app/editor/load';
export const ERROR_LOADING_NOTE = 'app/editor/error';
export const START_LOADING_NOTE = 'app/editor/start';
export const UPDATE_LOADED_NOTE = 'app/editor/update';

interface loadNoteAction {
    type: typeof LOAD_NOTE
    payload: Note
}

interface loadErrorAction {
    type: typeof ERROR_LOADING_NOTE
}

interface startLoadingAction {
    type: typeof START_LOADING_NOTE
}

interface updateLoadedNoteAction {
    type: typeof UPDATE_LOADED_NOTE
    payload: LoadedNote
}

export interface LoadedNoteState {
    editor: LoadedNote
    status: { loadError: boolean, isLoading: boolean }
}

export interface LoadedNote {
    id: string
    title: string
    lastSaved: Dayjs
    editorState: EditorState
    loadError?: boolean
}

export type EditorActionTypes = loadNoteAction | updateLoadedNoteAction | loadErrorAction | startLoadingAction
