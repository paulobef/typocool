import {convertToRaw, EditorState, ContentState } from "draft-js";
import {loadNotes} from "./actions";
import {firestore, RootState} from "../index";
import {AppThunkAction} from "../types";
import {getNotesFromFirestore} from "../utils";
import user from "../user/reducers";

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


export const createNote = (navigate: (location: string) => void): AppThunkAction => async (dispatch, getState) => {
    const state: RootState = getState();
    const uid = state.auth.user.uid;
    if (!uid) throw new Error('no uid');
    const noteRef = firestore.collection('notes').doc();
    await noteRef.set({
        title: '',
        content: convertToRaw(EditorState.createEmpty().getCurrentContent()),
        authorId: uid
    });
    const notes = await getNotesFromFirestore(uid);
    dispatch(loadNotes(notes));
    navigate('notes/' + noteRef.id)
};

export const updateNote = (id: string, title: string, content: ContentState): AppThunkAction => async (dispatch, getState) => {
    const state: RootState = getState();
    const uid = state.auth.user.uid;
    const noteRef = firestore.collection('notes').doc(id);
    await noteRef.set({
        authorId: uid,
        title: title,
        content: convertToRaw(content),
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
