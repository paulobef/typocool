import {errorLoading, loadSettings, startLoading} from "./actions";
import {firestore, RootState} from "../index";
import {AppThunkAction} from "../types";
import {settingsConverter} from "../utils";
import dayjs from "dayjs"
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
// @ts-ignore
import relativeTime from "dayjs/plugin/relativeTime";
import {Settings} from "./types";

dayjs.extend(isToday)
dayjs.extend(isYesterday)
dayjs.extend(relativeTime)


// READ BEFORE UPDATING THIS FILE
// We don't use withConverter.toFirestore method when creating/setting data
// because we want firebase to generate the id instead of us and therefore don't pass the id to set() or add()
// which expect a complete Note class and thus throw type error

export const listenToSettingsUpdates = (): AppThunkAction => async (dispatch, getState) => {
    dispatch(startLoading())
    const state: RootState = getState();
    const uid = state.auth.user.uid;
    if (!uid) return
    try {
        firestore
            .collection("settings")
            .withConverter(settingsConverter)
            .doc(uid)
            .onSnapshot(function (settingsSnap) {
                const settings = settingsSnap.data();
                if(!settings) { dispatch(errorLoading()); throw new Error('there are no settings for this user');  }
                dispatch(loadSettings(settings));
            })
        console.log('realtime update')
    } catch (error) {
        dispatch(errorLoading())
        console.log(error)
    }
}

export const updateSettings = (settings: Settings): AppThunkAction => async (dispatch, getState) => {
    dispatch(startLoading())
    const state: RootState = getState();
    const uid = state.auth.user.uid;
    try {
        setTimeout(async () => {
            const noteRef = firestore.collection('settings').doc(uid);
            await noteRef.set({ ...settings, lastSaved: settings.lastSaved.toISOString()});
        }, 500)
    } catch (error) {
        dispatch(errorLoading())
        console.log(error)
    }

}
