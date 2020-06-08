import { Status } from './../types';

export const RECEIVE_USER_DATA = "app/user/receive";
export const START_CREATING_USER = "app/user/start_creation"
export const SUCCESS_CREATING_USER = "app/user/success_creation"
export const ERROR_CREATING_USER = "app/user/error_creation"

export class User {
    constructor(readonly uid: string, readonly firstName: string, readonly lastName: string, readonly email: string) {}

    toString(): string {
        return `${this.firstName} ${this.lastName}`;
    }
}

export interface receiveUserData {
    type: typeof RECEIVE_USER_DATA
    payload: User
}

export interface startUserCreation {
    type: typeof START_CREATING_USER
}

export interface userCreationSuccess {
    type: typeof SUCCESS_CREATING_USER
}

export interface userCreationError {
    type: typeof ERROR_CREATING_USER
}


export interface UserState {
    status: Status
    user: User
}

export type UserActionTypes = receiveUserData | startUserCreation | userCreationError | userCreationSuccess
