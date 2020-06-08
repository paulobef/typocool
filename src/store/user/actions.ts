import {RECEIVE_USER_DATA, User, UserActionTypes, START_CREATING_USER, SUCCESS_CREATING_USER, ERROR_CREATING_USER} from "./types";


export const receiveUserData = (payload: User): UserActionTypes => {
    return {
        type: RECEIVE_USER_DATA,
        payload
    }
};

export const startUserCreation = (): UserActionTypes => {
    return {
        type: START_CREATING_USER
    }
}

export const userCreationSuccess = (): UserActionTypes => {
    return {
        type: SUCCESS_CREATING_USER
    }
}

export const userCreationError = (): UserActionTypes => {
    return {
        type: ERROR_CREATING_USER
    }
}
