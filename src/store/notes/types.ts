import {ContentState} from "draft-js";
import {Dayjs} from "dayjs"
import firebase from "firebase";

export const START_LOADING_INIT = 'app/notes/start_init';
export const ERROR_LOADING_INIT = 'app/notes/error_init';
export const LOAD_NOTES = 'app/notes/load';
export const START_LOADING_MORE = 'app/notes/start_more';
export const ERROR_LOADING_MORE = 'app/notes/error_more'
export const LOAD_MORE_NOTES = 'app/notes/more';



// STATE TYPES
export class Note {
    constructor(readonly id: string, readonly title: string, readonly content: ContentState, readonly authorId: string, readonly lastSaved: Dayjs) {
    }

    toString(): string {
        return `authorId: ${this.authorId} title: ${this.title}, content: ${this.content.toString()}, lastSaved: ${this.lastSaved.toJSON()}`;
    }
}

export interface NoteState {
    notes: Note[]
    status: {
        loadErrorInit: boolean
        isLoadingInit: boolean
        loadErrorMore: boolean
        isLoadingMore: boolean
    }
    lastVisible: firebase.firestore.QueryDocumentSnapshot
}
interface loadNotesAction {
    type: typeof LOAD_NOTES
    payload: { notes: Note[], lastVisible: firebase.firestore.QueryDocumentSnapshot }
}

interface loadMoreNotesAction {
    type: typeof LOAD_MORE_NOTES
    payload: { notes: Note[], lastVisible: firebase.firestore.QueryDocumentSnapshot }
}

interface startLoadingAction {
    type: typeof START_LOADING_INIT | typeof START_LOADING_MORE
}

interface errorLoadingAction {
    type: typeof ERROR_LOADING_INIT | typeof ERROR_LOADING_MORE
}



export type NoteActionTypes = loadNotesAction | loadMoreNotesAction | startLoadingAction | errorLoadingAction
