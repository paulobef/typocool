import {useSelector} from "react-redux";
import {RootState} from "../index";

export function useLastNoteId() {
    const notes = useSelector((state: RootState) => state.notes.notes)
    return Math.max.apply(null, notes.map(note => note.id)) !== -Infinity ? Math.max.apply(null, notes.map(note => note.id)) : 0
}
