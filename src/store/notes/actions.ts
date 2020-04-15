import {
    LOAD_NOTES,
    Note,
    NoteActionTypes,
} from './types'

export function loadNotes(payload: Note[]): NoteActionTypes {
    return {
        type: LOAD_NOTES,
        payload
    }
}

