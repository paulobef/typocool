import {User} from "./user/types";
import {firestore} from "./index";
import firebase from "firebase";
import {Note, NoteState} from "./notes/types";
import {convertFromRaw, convertToRaw} from "draft-js";
import dayjs from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import relativeTime from "dayjs/plugin/relativeTime";
import {Settings, SettingsState} from "./settings/types";
import {AppStateWithLoading} from "./types";
import {LoadedNoteState} from "./editor/types";
import { AuthState } from "./auth/types";

dayjs.extend(isToday)
dayjs.extend(isYesterday)
dayjs.extend(relativeTime)


type DocumentData = firebase.firestore.DocumentData;
type QueryDocumentSnapshot = firebase.firestore.QueryDocumentSnapshot;
type SnapshotOptions = firebase.firestore.SnapshotOptions;

// Converters

export const userConverter = {
    toFirestore(user: User): DocumentData {
        return { firstName: user.firstName, lastName: user.lastName, email: user.email };
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): User {
        const data = snapshot.data(options)!;
        const id = snapshot.id!;
        return new User(id, data.firstName, data.lastName, data.email);
    }
};

export const noteConverter = {
    toFirestore(note: Note): DocumentData {
        return { title: note.title, content: convertToRaw(note.content), authorId: note.authorId, lastSaved: note.lastSaved};
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): Note {
        const data = snapshot.data(options)!;
        const id = snapshot.id!;
        return new Note(id, data.title, convertFromRaw(data.content), data.authorId, dayjs(data.lastSaved));
    }
};

export const settingsConverter = {
    toFirestore(settings: Settings): DocumentData {
        return { fontSize: settings.fontSize, fontFamily: settings.fontFamily, lastSaved: settings.lastSaved};
    },
    fromFirestore(
        snapshot: QueryDocumentSnapshot,
        options: SnapshotOptions
    ): Settings {
        const data = snapshot.data(options)!;
        return new Settings(data.fontSize, data.fontFamily, dayjs(data.lastSaved));
    }
};

export const getUserFromFirestore = async (uid: string): Promise<User> => {
    const userRef = await firestore.collection('users').withConverter(userConverter).doc(uid).get();
    const dbUser = userRef.data();
    if (!dbUser) throw new Error('no user');
    console.log(dbUser.toString());
    return dbUser
}



export const getNotesFromFirestore = async (uid: string): Promise<Array<Note>> => {
    const notesSnap = await firestore.collection('notes').withConverter(noteConverter).where('authorId', '==', uid).orderBy('lastSaved', 'desc').limit(50).get();
    return notesSnap.docs.map(note => note.data());
};

export const getOneNoteFromFirestore = async (id: string): Promise<Note | undefined> => {
    if (!id) throw new Error('no id')
    const noteSnap = await firestore.collection('notes').withConverter(noteConverter).doc(id).get();
    if(!noteSnap.exists)  { return undefined }
    return noteSnap.data()
};

export function startLoading(state: AppStateWithLoading, statusName: string): AppStateWithLoading {
    const status = { ...state.status, ...{ [statusName]: true } }
    return <NoteState | LoadedNoteState | SettingsState>Object.freeze({...state, status})
}
export function endLoadingWithError(state: AppStateWithLoading, loadingStateName: string, errorStateName: string): AppStateWithLoading {
    const status = { ...state.status, ...{ [loadingStateName]: false, [errorStateName]: true }}
    return <NoteState | LoadedNoteState | SettingsState>Object.freeze({...state, status})
}
