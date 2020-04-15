import { AppThunkAction } from "../types";
import { getOneNoteFromFirestore } from "../utils";
import { loadNoteInEditor } from "./actions";

export const getNoteForEdition = (id: string): AppThunkAction => async (dispatch, getState) => {
    const note = await getOneNoteFromFirestore(id)
    if (note) {
        dispatch(loadNoteInEditor(note));
    }
};
