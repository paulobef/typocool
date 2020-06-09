import { EditorState } from "draft-js";
import { Dayjs } from "dayjs";
import firebase from "firebase";

export const START_LOADING_INIT = "app/notes/start_init";
export const ERROR_LOADING_INIT = "app/notes/error_init";
export const LOAD_NOTES = "app/notes/load";
export const START_LOADING_MORE = "app/notes/start_more";
export const START_LOADING_EDITOR = "app/notes/start_editor";
export const ERROR_LOADING_EDITOR = "app/notes/error_editor";
export const ERROR_LOADING_MORE = "app/notes/error_more";
export const LOAD_MORE_NOTES = "app/notes/more";
export const UPDATE_LOADED_NOTE = "app/notes/update_loaded";
export const UPDATE_NOTE_FROM_SERVER = "app/notes/update_from_server";
export const SELECT_NOTE = "app/notes/select";
export const VISIT_NOTE = "app/notes/visit";

// STATE TYPES
export class Note {
  constructor(
    readonly id: string,
    readonly title: string,
    readonly state: EditorState,
    readonly authorId: string,
    readonly lastSaved: Dayjs,
    readonly version: number
  ) {}

  toString(): string {
    return `authorId: ${this.authorId} title: ${
      this.title
    }, content: ${this.state.toString()}, lastSaved: ${this.lastSaved.toJSON()}`;
  }
}

export interface NoteState {
  notes: Note[];
  status: {
    loadErrorInit: boolean;
    isLoadingInit: boolean;
    loadErrorMore: boolean;
    isLoadingMore: boolean;
    isLoadingEditor: boolean;
    loadErrorEditor: boolean;
  };
  selectedNote: {
    id?: string;
    visited: boolean;
    unsubscribe?: Function; // not very Redux-ish but necessary to be able to unsubscribe from previously selected note and save bandwidth and reads
  };
  lastVisible: firebase.firestore.QueryDocumentSnapshot;
}

interface visitSelectedNoteAction {
  type: typeof VISIT_NOTE;
}

interface loadNotesAction {
  type: typeof LOAD_NOTES;
  payload: {
    notes: Note[];
    lastVisible: firebase.firestore.QueryDocumentSnapshot;
  };
}

interface loadMoreNotesAction {
  type: typeof LOAD_MORE_NOTES;
  payload: {
    notes: Note[];
    lastVisible: firebase.firestore.QueryDocumentSnapshot;
  };
}

interface startLoadingAction {
  type:
    | typeof START_LOADING_INIT
    | typeof START_LOADING_MORE
    | typeof START_LOADING_EDITOR;
}

interface errorLoadingAction {
  type:
    | typeof ERROR_LOADING_INIT
    | typeof ERROR_LOADING_MORE
    | typeof ERROR_LOADING_EDITOR;
}

interface updateLoadedNoteAction {
  type: typeof UPDATE_LOADED_NOTE;
  payload: Note;
}

interface updateNoteFromServerAction {
  type: typeof UPDATE_NOTE_FROM_SERVER;
  payload: Note;
}

interface updateSelectedNoteAction {
  type: typeof SELECT_NOTE;
  payload: {
    id: string;
    unsubscribe: Function;
  };
}

export type NoteActionTypes =
  | loadNotesAction
  | loadMoreNotesAction
  | startLoadingAction
  | errorLoadingAction
  | updateLoadedNoteAction
  | updateNoteFromServerAction
  | updateSelectedNoteAction
  | visitSelectedNoteAction;
