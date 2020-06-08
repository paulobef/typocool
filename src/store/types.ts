import { UserState } from './user/types';
import {NoteState} from "./notes/types";
import {ThunkAction} from "redux-thunk";
import {RootState} from "./index";
import {AnyAction} from "redux";
import {SettingsState} from "./settings/types";
import { LoadedNoteState} from "./editor/types";
export type AppStateWithLoading = NoteState | LoadedNoteState | SettingsState | UserState
export type AppThunkAction = ThunkAction<void, RootState, unknown, AnyAction>;

export interface Status {
    error: boolean
    isLoading: boolean
}