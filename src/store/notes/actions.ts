import {
    LOAD_NOTES,
    LOAD_MORE_NOTES,
    Note,
    NoteActionTypes, START_LOADING_INIT, START_LOADING_MORE, ERROR_LOADING_INIT, ERROR_LOADING_MORE,
} from './types'
import firebase from "firebase";

export function loadNotes(payload: { notes: Note[], lastVisible: firebase.firestore.QueryDocumentSnapshot }): NoteActionTypes {
    return {
        type: LOAD_NOTES,
        payload
    }
}

export function loadMoreNotes(payload: { notes: Note[], lastVisible: firebase.firestore.QueryDocumentSnapshot }): NoteActionTypes {
    return {
        type: LOAD_MORE_NOTES,
        payload
    }
}

export function startLoadingInit(): NoteActionTypes {
    return {
        type: START_LOADING_INIT,
    }
}

export function startLoadingMore(): NoteActionTypes {
    return {
        type: START_LOADING_MORE,
    }
}

export function errorLoadingInit(): NoteActionTypes {
    return {
        type: ERROR_LOADING_INIT,
    }
}

export function errorLoadingMore(): NoteActionTypes {
    return {
        type: ERROR_LOADING_MORE,
    }
}


