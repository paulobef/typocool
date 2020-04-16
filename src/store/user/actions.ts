import {RECEIVE_USER_DATA, User, UserActionTypes} from "./types";


export const receiveUserData = (payload: User): UserActionTypes => {
    return {
        type: RECEIVE_USER_DATA,
        payload
    }
};

