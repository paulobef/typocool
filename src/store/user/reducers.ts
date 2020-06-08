import { initStatus, startLoading, endLoadingWithError } from './../utils';
import {RECEIVE_USER_DATA, UserActionTypes, User, UserState, ERROR_CREATING_USER, START_CREATING_USER} from "./types";


//stores user data from firestore collection, which is different from authenticated user object which comes from firebase auth
function receiveUserData(state: UserState, payload: User): UserState {
    return Object.freeze({ ...state, user: payload, status: initStatus() });
}

const initialState: UserState = {
    status: initStatus(),
    user: Object.create(null)
}


export default function user(state = initialState, action: UserActionTypes): UserState {
    switch (action.type) {
        case RECEIVE_USER_DATA:
            return receiveUserData(state, action.payload);
        case START_CREATING_USER:
            return startLoading(state, 'isLoading') as UserState
        case ERROR_CREATING_USER:
            return endLoadingWithError(state, 'isLoading', 'error') as UserState
        default:
            return state
    }
}
