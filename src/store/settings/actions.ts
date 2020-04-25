import {
    LOAD_SETTINGS,
    Settings,
    SettingsActionTypes, START_LOADING, ERROR_LOADING
} from './types'

export function loadSettings(payload: Settings): SettingsActionTypes {
    return {
        type: LOAD_SETTINGS,
        payload
    }
}

export function startLoading(): SettingsActionTypes {
    return {
        type: START_LOADING
    }
}

export function errorLoading(): SettingsActionTypes {
    return {
        type: ERROR_LOADING,
    }
}



