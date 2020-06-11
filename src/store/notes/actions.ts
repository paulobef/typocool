import {
  UPDATE_LOADED_NOTE,
  UPDATE_NOTE_FROM_SERVER,
  LOAD_NOTES,
  LOAD_MORE_NOTES,
  Note,
  NoteActionTypes,
  START_LOADING_INIT,
  START_LOADING_MORE,
  ERROR_LOADING_INIT,
  ERROR_LOADING_MORE,
  START_LOADING_EDITOR,
  ERROR_LOADING_EDITOR,
  SELECT_NOTE,
  VISIT_NOTE,
  DELETE_LOADED_NOTE,
} from "./types";
import firebase from "firebase";

export function loadNotes(payload: {
  notes: Note[];
  nextQuery: firebase.firestore.Query;
}): NoteActionTypes {
  return {
    type: LOAD_NOTES,
    payload,
  };
}

export function loadMoreNotes(payload: {
  notes: Note[];
  nextQuery: firebase.firestore.Query;
}): NoteActionTypes {
  return {
    type: LOAD_MORE_NOTES,
    payload,
  };
}

export function updateSelectedNote(payload: {
  id: string;
  unsubscribe: Function;
}): NoteActionTypes {
  return {
    type: SELECT_NOTE,
    payload,
  };
}

export function startLoadingEditor(): NoteActionTypes {
  return {
    type: START_LOADING_EDITOR,
  };
}

export function errorLoadingEditor(): NoteActionTypes {
  return {
    type: ERROR_LOADING_EDITOR,
  };
}

export function startLoadingInit(): NoteActionTypes {
  return {
    type: START_LOADING_INIT,
  };
}

export function startLoadingMore(): NoteActionTypes {
  return {
    type: START_LOADING_MORE,
  };
}

export function errorLoadingInit(): NoteActionTypes {
  return {
    type: ERROR_LOADING_INIT,
  };
}

export function errorLoadingMore(): NoteActionTypes {
  return {
    type: ERROR_LOADING_MORE,
  };
}

export function updateLoadedNote(payload: Note): NoteActionTypes {
  return {
    type: UPDATE_LOADED_NOTE,
    payload,
  };
}

export function updateNoteFromServer(payload: Note): NoteActionTypes {
  return {
    type: UPDATE_NOTE_FROM_SERVER,
    payload,
  };
}

export function visitSelectedNote(): NoteActionTypes {
  return {
    type: VISIT_NOTE,
  };
}

export function deleteLoadedNote(payload: string): NoteActionTypes {
  return {
    type: DELETE_LOADED_NOTE,
    payload,
  };
}
