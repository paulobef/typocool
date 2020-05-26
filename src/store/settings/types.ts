import {Dayjs} from "dayjs"

export const START_LOADING = 'app/settings/start_init';
export const ERROR_LOADING = 'app/settings/error_init';
export const LOAD_SETTINGS = 'app/settings/load';



// STATE TYPES
export class Settings {
    constructor(readonly fontSize: number, readonly fontFamily: string, readonly lastSaved: Dayjs) {
    }

    toString(): string {
        return `fontSize: ${this.fontSize}, fontFamily: ${this.fontFamily}, lastSaved: ${this.lastSaved.toJSON()}`;
    }
}

export interface SettingsState {
    settings: Settings
    status: {
        loadError: boolean
        isLoading: boolean
    }
}
interface loadSettingsAction {
    type: typeof LOAD_SETTINGS
    payload: Settings
}

interface startLoadingAction {
    type: typeof START_LOADING
}

interface errorLoadingAction {
    type: typeof ERROR_LOADING
}



export type SettingsActionTypes = loadSettingsAction | startLoadingAction | errorLoadingAction
