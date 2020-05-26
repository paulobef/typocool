
export const RECEIVE_USER_DATA = "app/user/receive";

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

export type UserActionTypes = receiveUserData
