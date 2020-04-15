import {ContentState} from "draft-js";

export const LOAD_NOTES = 'app/notes/load';


// STATE TYPES
export class Note {
    constructor(readonly id: string, readonly title: string, readonly content: ContentState, readonly authorId: string) {}

    toString(): string {
        return `authorId: ${this.authorId} title: ${this.title}, content: ${this.content.toString()}`;
    }
}

export interface NoteState {
    notes: Note[]
}
interface loadNotesAction {
    type: typeof LOAD_NOTES
    payload: Note[]
}



export type NoteActionTypes = loadNotesAction
