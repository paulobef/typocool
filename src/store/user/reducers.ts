import {RECEIVE_USER_DATA, UserActionTypes, User} from "./types";


//stores user data from firestore collection, which is different from authenticated user object which comes from firebase auth
function receiveUserData(state: User, payload: User): User {
    return Object.freeze({ ...state, ...payload });
}


export default function user(state = Object.create(null), action: UserActionTypes) {
    switch (action.type) {
        case RECEIVE_USER_DATA:
            return receiveUserData(state, action.payload);
        default:
            return state
    }
}
