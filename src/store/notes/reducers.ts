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
} from "./types";
import firebase from "firebase";
import { endLoadingWithError, startLoading } from "../utils";

function loadNotes(
  state: NoteState,
  payload: {
    notes: Note[];
    lastVisible: firebase.firestore.QueryDocumentSnapshot;
  }
): NoteState {
  const status = {
    ...state.status,
    isLoadingInit: false,
    loadErrorInit: false,
  };
  return Object.freeze({
    ...state,
    notes: payload.notes,
    status,
    lastVisible: payload.lastVisible,
  });
}
function loadMoreNotes(
  state: NoteState,
  payload: {
    notes: Note[];
    lastVisible: firebase.firestore.QueryDocumentSnapshot;
  }
): NoteState {
  const notes = [...state.notes, ...payload.notes];
  const status = {
    ...state.status,
    isLoadingMore: false,
    loadErrorMore: false,
  };
  return Object.freeze({
    ...state,
    notes,
    status,
    lastVisible: payload.lastVisible,
  });
}

function updateLoadedNote(state: NoteState, payload: Note): NoteState {
  const newNotes = state.notes.map((note) =>
    note.id === payload.id ? payload : note
  );
  return Object.freeze(
    Object.assign({}, state, {
      notes: newNotes,
    })
  );
}

function updateNoteFromServer(state: NoteState, payload: Note): NoteState {
  const newNotes = state.notes.map((note) => {
    if (note.id === payload.id && note.version < payload.version) {
      return payload;
    }
    return note;
  });
  return Object.freeze(
    Object.assign({}, state, {
      notes: newNotes,
    })
  );
}

const initialState: NoteState = Object.freeze({
  notes: [],
  status: {
    loadErrorInit: false,
    isLoadingInit: false,
    loadErrorMore: false,
    isLoadingMore: false,
  },
  lastVisible: Object.create(null),
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
      return <NoteState>startLoading(state, "isLoadingInit");
    case START_LOADING_MORE:
      return <NoteState>startLoading(state, "isLoadingMore");
    case ERROR_LOADING_INIT:
      return <NoteState>(
        endLoadingWithError(state, "isLoadingInit", "loadErrorInit")
      );
    case ERROR_LOADING_MORE:
      return <NoteState>(
        endLoadingWithError(state, "isLoadingMore", "loadErrorMore")
      );
    case UPDATE_LOADED_NOTE:
      return updateLoadedNote(state, action.payload);
    case UPDATE_NOTE_FROM_SERVER:
      return updateNoteFromServer(state, action.payload);
    default:
      return state;
  }
}
