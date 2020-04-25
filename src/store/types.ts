import {NoteState} from "./notes/types";
import {AuthState} from "./auth/types";
import {ThunkAction} from "redux-thunk";
import {RootState} from "./index";
import {AnyAction} from "redux";
import {SettingsState} from "./settings/types";
import { LoadedNoteState} from "./editor/types";
export type AppStateWithLoading = NoteState | LoadedNoteState | SettingsState
export type AppThunkAction = ThunkAction<void, RootState, unknown, AnyAction>;
