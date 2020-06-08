import { AppThunkAction } from "../types";
import { getOneNoteFromFirestore } from "../utils";
import {loadError, loadNoteInEditor, startLoading} from "./actions";

export const getNoteForEdition = (id: string): AppThunkAction => async (dispatch, getState) => {
    dispatch(startLoading());
    try {
        const note = await getOneNoteFromFirestore(id)
        if (note) {
            dispatch(loadNoteInEditor(note));
        } else {
            dispatch(loadError())
        }
    } catch (error) {
        console.log(error)
    }

};
