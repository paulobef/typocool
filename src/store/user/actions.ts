import {RECEIVE_USER_DATA, UserActionTypes, UserState} from "./types";


export const receiveUserData = (payload: UserState): UserActionTypes => {
    return {
        type: RECEIVE_USER_DATA,
        payload
    }
};

