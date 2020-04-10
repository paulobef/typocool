import {combineReducers, createStore, applyMiddleware, AnyAction} from "redux";
import thunk, {ThunkDispatch} from 'redux-thunk';
import notes from "./notes/reducers";
import auth from "./auth/reducers"
import * as firebase from 'firebase/app'
import 'firebase/auth'
import { firebaseConfig } from '../firebaseConfig'
import {verifyAuth} from "./auth/thunks";

// Initialize firebase instance
export const firebaseApp = firebase.initializeApp(firebaseConfig)

// Initialize other services on firebase instance
export const db = firebase.firestore();
// firebase.functions() // <- needed if using httpsCallable

const noteApp = combineReducers({
    notes,
    auth
})
export type RootState = ReturnType<typeof noteApp>


export default function configureStore(persistedState?: RootState) {
    const store = createStore(
        noteApp,
        persistedState,
        applyMiddleware(thunk)
    );
    (store.dispatch as ThunkDispatch<RootState, void, AnyAction>)(verifyAuth());
    return store;
}
