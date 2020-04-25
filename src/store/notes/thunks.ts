import {convertToRaw, EditorState, ContentState } from "draft-js";
import {errorLoadingInit, errorLoadingMore, loadMoreNotes, loadNotes, startLoadingMore} from "./actions";
import {firestore, RootState} from "../index";
import {AppThunkAction} from "../types";
import {noteConverter} from "../utils";
import dayjs, {Dayjs} from "dayjs"
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
// @ts-ignore
import relativeTime from "dayjs/plugin/relativeTime";
import notes from "./reducers";
import {startLoadingInit} from "../notes/actions";

dayjs.extend(isToday)
dayjs.extend(isYesterday)
dayjs.extend(relativeTime)

const LIMIT = 20

// READ BEFORE UPDATING THIS FILE
// We don't use withConverter.toFirestore method when creating/setting data
// because we want firebase to generate the id instead of us and therefore don't pass the id to set() or add()
// which expect a complete Note class and thus throw type error

export const listenToNotesUpdates = (): AppThunkAction => async (dispatch, getState) => {
    dispatch(startLoadingInit())
    const state: RootState = getState();
    const uid = state.auth.user.uid;
    if (!uid) return
    try {
        firestore.collection("notes").withConverter(noteConverter).where('authorId', '==', uid).orderBy('lastSaved', 'desc').limit(LIMIT)
            .onSnapshot(function (notesSnap) {
                const lastVisible = notesSnap.docs[notesSnap.docs.length-1];
                const notes = notesSnap.docs.map(note => note.data());
                dispatch(loadNotes( { notes, lastVisible }));
            })
        console.log('realtime update')
    } catch (error) {
        dispatch(errorLoadingInit())
        console.log(error)
    }
}

export const fetchMoreNotes = (): AppThunkAction => async (dispatch, getState) => {
    dispatch(startLoadingMore())
    const state: RootState = getState();
    const uid = state.auth.user.uid;
    const currentLastVisible = state.notes.lastVisible
    if (!uid) throw new Error('no note to fetch, last visible is empty')
    try {
        if (!currentLastVisible) throw new Error('no note to fetch, last visible is empty')
        const notesSnap = await firestore.collection("notes").withConverter(noteConverter).where('authorId', '==', uid).orderBy('lastSaved', 'desc').startAfter(currentLastVisible).limit(LIMIT)
            .get();
        const lastVisible = notesSnap.docs[notesSnap.docs.length-1];
        const notes = notesSnap.docs.map(note => note.data())
        dispatch(loadMoreNotes({ notes, lastVisible }));
        console.log('more loaded')

    } catch (e) {
        dispatch(errorLoadingMore())
        console.log(e)
    }
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
}

export const deleteNote = (id: string): AppThunkAction => async (dispatch, getState) => {
    const noteRef = firestore.collection('notes').doc(id);
    await noteRef.delete();
};
