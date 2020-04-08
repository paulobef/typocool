import {combineReducers, createStore, Reducer} from "redux";
import {notes} from "./notes/reducers";

const noteApp = combineReducers({
    notes
})
export type RootState = ReturnType<typeof noteApp>
export default createStore(noteApp);
