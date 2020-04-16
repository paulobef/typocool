import {convertToRaw, EditorState, ContentState } from "draft-js";
import {loadNotes} from "./actions";
import {firestore, RootState} from "../index";
import {AppThunkAction} from "../types";
import {getNotesFromFirestore} from "../utils";
import dayjs, {Dayjs} from "dayjs"
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(isToday)
dayjs.extend(isYesterday)
dayjs.extend(relativeTime)


// READ BEFORE UPDATING THIS FILE
// We don't use withConverter.toFirestore method when creating/setting data
// because we want firebase to generate the id instead of us and therefore don't pass the id to set() or add()
// which expect a complete Note class and thus throw type error

export const loadNotesFromFirestore = (): AppThunkAction => async (dispatch, getState) => {
    const state: RootState = getState();
    const uid = state.auth.user.uid;
    const notes = await getNotesFromFirestore(uid);
    dispatch(loadNotes(notes));
}


export const createNote = (currentLocation: string, navigate: (location: string) => void): AppThunkAction => async (dispatch, getState) => {
    const state: RootState = getState();
    const uid = state.auth.user.uid;
    if (!uid) throw new Error('no uid');
    const noteRef = firestore.collection('notes').doc();
    await noteRef.set({
        title: '',
        content: convertToRaw(EditorState.createEmpty().getCurrentContent()),
        authorId: uid,
        lastSaved: dayjs().toISOString(),
    });
    const notes = await getNotesFromFirestore(uid);
    dispatch(loadNotes(notes));
    if (currentLocation.includes('notes/')) {
        navigate(noteRef.id)
    } else {
        navigate('notes/' + noteRef.id)
    }
};

export const updateNote = (id: string, title: string, content: ContentState, lastSaved: Dayjs): AppThunkAction => async (dispatch, getState) => {
    const state: RootState = getState();
    const uid = state.auth.user.uid;
    const noteRef = firestore.collection('notes').doc(id);
    await noteRef.set({
        authorId: uid,
        title,
        content: convertToRaw(content),
        lastSaved: lastSaved.toISOString(),
    });
    const notes = await getNotesFromFirestore(uid);
    dispatch(loadNotes(notes));
}

export const deleteNote = (id: string): AppThunkAction => async (dispatch, getState) => {
    const user = getState().user;
    const noteRef = firestore.collection('notes').doc(id);
    await noteRef.delete();

    const notes = await getNotesFromFirestore(user.uid);
    dispatch(loadNotes(notes));
};
