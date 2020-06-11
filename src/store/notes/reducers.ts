import {
  UPDATE_LOADED_NOTE,
  UPDATE_NOTE_FROM_SERVER,
  ERROR_LOADING_INIT,
  ERROR_LOADING_MORE,
  LOAD_MORE_NOTES,
  LOAD_NOTES,
  Note,
  NoteActionTypes,
  NoteState,
  START_LOADING_INIT,
  START_LOADING_MORE,
  ERROR_LOADING_EDITOR,
  START_LOADING_EDITOR,
  SELECT_NOTE,
  VISIT_NOTE,
  DELETE_LOADED_NOTE,
} from "./types";
import firebase from "firebase";
import { endLoadingWithError, startLoading } from "../utils";

function updateSelectedNote(
  state: NoteState,
  payload: { id: string; unsubscribe: Function }
): NoteState {
  return Object.freeze({
    ...state,
    selectedNote: { ...payload, visited: false },
  });
}

function loadNotes(
  state: NoteState,
  payload: {
    notes: Note[];
    nextQuery: firebase.firestore.Query;
  }
): NoteState {
  const status = {
    ...state.status,
    isLoadingInit: false,
    loadErrorInit: false,
  };
  return Object.freeze({
    ...state,
    notes: [...state.notes, ...payload.notes],
    status,
    nextQuery: payload.nextQuery,
  });
}
function loadMoreNotes(
  state: NoteState,
  payload: {
    notes: Note[];
    nextQuery: firebase.firestore.Query;
  }
): NoteState {
  const newNotes = [...state.notes, ...payload.notes];
  const status = {
    ...state.status,
    isLoadingMore: false,
    loadErrorMore: false,
  };
  return Object.freeze({
    ...state,
    notes: newNotes,
    status,
    nextQuery: payload.nextQuery,
  });
}

function updateLoadedNote(state: NoteState, payload: Note): NoteState {
  const newNotes = state.notes.map((note) =>
    note.id === payload.id ? payload : note
  );
  return Object.freeze({
    ...state,
    ...{
      notes: newNotes,
    },
  });
}

function updateNoteFromServer(state: NoteState, payload: Note): NoteState {
  const newStatus = {
    ...state.status,
    isLoadingEditor: false,
    loadErrorEditor: false,
  };
  const existingNote = state.notes.find((note) => note.id === payload.id);
  if (existingNote !== null || existingNote !== undefined) {
    const newNotes = state.notes.map((note) => {
      if (note.id === payload.id && note.version < payload.version) {
        console.log("updated");
        return payload;
      }
      return note;
    });
    return Object.freeze({
      ...state,
      ...{
        notes: newNotes,
        status: newStatus,
      },
    });
  } else {
    const newNotes = [...state.notes, payload];
    return Object.freeze({
      ...state,
      ...{
        notes: newNotes,
        status: newStatus,
      },
    });
  }
}

function visitSelectedNote(state: NoteState): NoteState {
  const newSelectedNote = { ...state.selectedNote, visited: true };
  return Object.freeze({ ...state, selectedNote: newSelectedNote });
}

function deleteLoadedNote(state: NoteState, payload: string): NoteState {
  const newStatus = {
    ...state.status,
    isLoadingEditor: false,
    loadErrorEditor: false,
  };
  const newNotes = state.notes.filter((note) => note.id !== payload);
  return Object.freeze({
    ...state,
    ...{
      notes: newNotes,
      status: newStatus,
    },
  });
}

const initialState: NoteState = Object.freeze({
  notes: [],
  status: {
    loadErrorInit: false,
    isLoadingInit: false,
    loadErrorMore: false,
    isLoadingMore: false,
    isLoadingEditor: false,
    loadErrorEditor: false,
  },
  selectedNote: {
    id: "",
    visited: false,
    unsubscribe: function () {},
  },
  nextQuery: Object.create(null),
});

export default function notes(
  state = initialState,
  action: NoteActionTypes
): NoteState {
  switch (action.type) {
    case LOAD_NOTES:
      return loadNotes(state, action.payload);
    case LOAD_MORE_NOTES:
      return loadMoreNotes(state, action.payload);
    case START_LOADING_INIT:
      return startLoading(state, "isLoadingInit") as NoteState;
    case START_LOADING_MORE:
      return startLoading(state, "isLoadingMore") as NoteState;
    case ERROR_LOADING_INIT:
      return endLoadingWithError(
        state,
        "isLoadingInit",
        "loadErrorInit"
      ) as NoteState;
    case ERROR_LOADING_MORE:
      return endLoadingWithError(
        state,
        "isLoadingMore",
        "loadErrorMore"
      ) as NoteState;
    case UPDATE_LOADED_NOTE:
      return updateLoadedNote(state, action.payload);
    case DELETE_LOADED_NOTE:
      return deleteLoadedNote(state, action.payload);
    case UPDATE_NOTE_FROM_SERVER:
      return updateNoteFromServer(state, action.payload);
    case START_LOADING_EDITOR:
      return startLoading(state, "isLoadingEditor") as NoteState;
    case ERROR_LOADING_EDITOR:
      return endLoadingWithError(
        state,
        "isLoadingEditor",
        "loadErrorEditor"
      ) as NoteState;
    case SELECT_NOTE:
      return updateSelectedNote(state, action.payload);
    case VISIT_NOTE:
      return visitSelectedNote(state);
    default:
      return state;
  }
}
