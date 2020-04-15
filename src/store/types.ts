import {NoteState} from "./notes/types";
import {AuthState} from "./auth/types";
import {ThunkAction} from "redux-thunk";
import {RootState} from "./index";
import {AnyAction} from "redux";

export type AppState = AuthState | NoteState
export type AppThunkAction = ThunkAction<void, RootState, unknown, AnyAction>;
