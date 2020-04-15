import {convertToRaw, EditorState, ContentState } from "draft-js";
import {loadNotes} from "./actions";
import {firestore} from "../index";
import {AppThunkAction} from "../types";
import {getNotesFromFirestore} from "../utils";

// READ BEFORE UPDATING THIS FILE
// We don't use withConverter.toFirestore method when creating/setting data
// because we want firebase to generate the id instead of us and therefore don't pass the id to set() or add()
// which expect a complete Note class and thus throw type error

export const createNote = (): AppThunkAction => async (dispatch, getState) => {
    const user = getState().user;
    const noteRef = firestore.collection('notes').doc();
    await noteRef.set({
        title: '',
        content: convertToRaw(EditorState.createEmpty().getCurrentContent()),
        authorId: user.uid
    });
    const notes = await getNotesFromFirestore(user.uid);
    dispatch(loadNotes(notes));
};

export const updateNote = (id: string, title: string, content: ContentState): AppThunkAction => async (dispatch, getState) => {
    const user = getState().user;
    const noteRef = firestore.collection('notes').doc(id);
    await noteRef.set({
        title: '',
        content: convertToRaw(EditorState.createEmpty().getCurrentContent()),
        authorId: user.uid
    });
    const notes = await getNotesFromFirestore(user.uid);
    dispatch(loadNotes(notes));
}

export const deleteNote = (id: string): AppThunkAction => async (dispatch, getState) => {
    const user = getState().user;
    const noteRef = firestore.collection('notes').doc(id);
    await noteRef.delete();

    const notes = await getNotesFromFirestore(user.uid);
    dispatch(loadNotes(notes));
};
