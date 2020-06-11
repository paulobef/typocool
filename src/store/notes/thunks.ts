import { verifyError } from "./../auth/actions";
import {
  convertToRaw,
  EditorState,
  ContentState,
  convertFromRaw,
} from "draft-js";
import {
  errorLoadingInit,
  errorLoadingMore,
  loadMoreNotes,
  loadNotes,
  startLoadingMore,
  updateNoteFromServer,
  startLoadingEditor,
  errorLoadingEditor,
  updateSelectedNote,
  deleteLoadedNote,
} from "./actions";
import { firestore, RootState } from "../index";
import { AppThunkAction } from "../types";
import { noteConverter } from "../utils";
import dayjs, { Dayjs } from "dayjs";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
// @ts-ignore
import relativeTime from "dayjs/plugin/relativeTime";
import { startLoadingInit } from "../notes/actions";
import { Note } from "./types";
import { isNullOrUndefined } from "util";

dayjs.extend(isToday);
dayjs.extend(isYesterday);
dayjs.extend(relativeTime);

const LIMIT = 20;

// READ BEFORE UPDATING THIS FILE
// We don't use withConverter.toFirestore method when creating/setting data
// because we want firebase to generate the id instead of us and therefore don't pass the id to set() or add()
// which expect a complete Note class and thus throw type error

const converter = (note: firebase.firestore.DocumentSnapshot) => {
  const id = note.id;
  const data = note.data();
  if (!data) throw new Error();
  const localNote = new Note(
    id,
    data.title,
    data.content && data.content !== ""
      ? EditorState.createWithContent(convertFromRaw(data.content))
      : EditorState.createEmpty(),
    data.authorId,
    dayjs(data.lastSaved),
    data.version ? data.version : 0
  );
  return localNote;
};

const query = (uid: string): firebase.firestore.Query =>
  firestore
    .collection("notes")
    .where("authorId", "==", uid)
    .orderBy("lastSaved", "desc")
    .limit(LIMIT);

export const fetchNotes = (): AppThunkAction => async (dispatch, getState) => {
  const state: RootState = getState();
  const { isLoadingInit } = state.notes.status;
  if (isLoadingInit) return; // make sure we don't load duplicate
  dispatch(startLoadingInit());
  const uid = state.auth.user.uid;
  if (!uid) return;
  try {
    query(uid)
      .get()
      .then((notesSnap) => {
        const lastVisible = notesSnap.docs[notesSnap.docs.length - 1];
        const notes: Note[] = notesSnap.docs.map(converter);
        dispatch(
          loadNotes({ notes, nextQuery: query(uid).startAfter(lastVisible) })
        );
      });
  } catch (error) {
    dispatch(errorLoadingInit());
    console.log(error);
  }
};

export const fetchMoreNotes = (): AppThunkAction => async (
  dispatch,
  getState
) => {
  const state: RootState = getState();
  const { isLoadingMore, isLoadingInit } = state.notes.status;
  if (isLoadingMore || isLoadingInit) return; // wait for loading previous page before fetching new batch
  dispatch(startLoadingMore());
  const uid = state.auth.user.uid;
  const nextQuery = state.notes.nextQuery;
  if (!uid) {
    throw new Error("no note to fetch, last visible is empty");
  }
  try {
    nextQuery.get().then((notesSnap) => {
      if (notesSnap.docs.length === 0 || notesSnap.docs.length === 1) {
        dispatch(errorLoadingMore());
        return;
      }
      const lastVisible = notesSnap.docs[notesSnap.docs.length - 1];
      const notes: Note[] = notesSnap.docs.map(converter);
      console.log("called");
      dispatch(
        loadMoreNotes({
          notes,
          nextQuery: query(uid).startAfter(lastVisible),
        })
      );
    });

    console.log("more loaded");
  } catch (e) {
    dispatch(errorLoadingMore());
    console.log(e);
  }
};

export const createNote = (
  currentLocation: string,
  navigate: (location: string) => void
): AppThunkAction => async (dispatch, getState) => {
  dispatch(startLoadingEditor());
  const state: RootState = getState();
  const uid = state.auth.user.uid;
  if (!uid) {
    dispatch(verifyError());
  }
  const noteRef = firestore.collection("notes").doc();
  try {
    await noteRef.set({
      title: "",
      content: convertToRaw(EditorState.createEmpty().getCurrentContent()),
      authorId: uid,
      lastSaved: dayjs().toISOString(),
      version: 0,
    });
    const unsubscribe = await firestore
      .collection("notes")
      .withConverter(noteConverter)
      .doc(noteRef.id)
      .onSnapshot(function (noteSnap) {
        console.log("listener called");
        const note = noteSnap.data();
        if (!note) {
          dispatch(errorLoadingEditor());
          return;
        }
        dispatch(updateNoteFromServer(note));
      });
    dispatch(updateSelectedNote({ id: noteRef.id, unsubscribe }));

    if (currentLocation.includes("notes/")) {
      navigate(noteRef.id);
    } else {
      navigate("notes/" + noteRef.id);
    }
  } catch (error) {
    dispatch(errorLoadingEditor());
  }
};

export const updateNote = (
  id: string,
  title: string,
  content: ContentState,
  lastSaved: Dayjs,
  version: number
): AppThunkAction => async (dispatch, getState) => {
  const state: RootState = getState();
  const uid = state.auth.user.uid;
  const noteRef = firestore.collection("notes").doc(id);
  await noteRef.set({
    authorId: uid,
    title,
    content: convertToRaw(content),
    lastSaved: lastSaved.toISOString(),
    version,
  });
};

export const deleteNote = (id: string): AppThunkAction => async (
  dispatch,
  getState
) => {
  dispatch(startLoadingEditor());
  try {
    const noteRef = firestore.collection("notes").doc(id);
    await noteRef.delete();
    dispatch(deleteLoadedNote(id));
  } catch (error) {
    dispatch(errorLoadingEditor());
  }
};

export const selectNote = (
  id: string,
  navigate: (location: string) => void
): AppThunkAction => async (dispatch, getState) => {
  const previouslySelected = getState().notes.selectedNote;
  if (previouslySelected.unsubscribe !== undefined) {
    await previouslySelected.unsubscribe();
    console.log("unsubscribed from: ", previouslySelected.id);
  }
  let unsubscribe = () => {};
  const isCollaborative = false;
  if (isCollaborative) {
    unsubscribe = firestore
      .collection("notes")
      .withConverter(noteConverter)
      .doc(id)
      .onSnapshot(function (noteSnap) {
        const note = noteSnap.data();
        if (!note) return;
        dispatch(updateNoteFromServer(note));
      });
  }
  console.log("selected note: ", id);
  dispatch(updateSelectedNote({ id, unsubscribe }));
  navigate("/notes/" + id);
};
