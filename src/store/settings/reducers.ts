import {
    ERROR_LOADING,
    LOAD_SETTINGS, START_LOADING,
    Settings, SettingsState, SettingsActionTypes
} from "./types";
import {endLoadingWithError, startLoading} from "../utils";
import dayjs from "dayjs";


function loadSettings(state: SettingsState, payload: Settings ): SettingsState {
    const status = { ...state.status, isLoading: false, loadError: false }
    return Object.freeze({
        ...state,
        settings: payload,
        status
    })
}


const initialState: SettingsState = Object.freeze({
    settings: {
        fontSize: 14,
        fontFamily: 'Sans Serif',
        lastSaved: dayjs()
    },
    status: {
        loadError: false,
        isLoading: false,
    },
});


export default function settings(state = initialState, action: SettingsActionTypes): SettingsState {
    switch (action.type) {
        case LOAD_SETTINGS: return loadSettings(state, action.payload);
        case START_LOADING: return <SettingsState>startLoading(state, 'isLoading')
        case ERROR_LOADING: return <SettingsState>endLoadingWithError(state, 'isLoading', 'loadError');
        default:
            return state
    }
}


