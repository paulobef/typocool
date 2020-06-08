import {
  combineReducers,
  createStore,
  applyMiddleware,
  AnyAction,
} from "redux";
import thunk, { ThunkDispatch } from "redux-thunk";
import notes from "./notes/reducers";
import auth from "./auth/reducers";
import user from "./user/reducers";
import * as firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import { firebaseConfig } from "../firebaseConfig";
import { verifyAuth } from "./auth/thunks";
import settings from "./settings/reducers";

export const LIMIT = 5;

// Initialize firebase instance
export const firebaseApp = firebase.initializeApp(firebaseConfig);

// Initialize other services on firebase instance
export const fireauth = firebaseApp.auth();
export const firestore = firebase.firestore();
// firebase.functions() // <- needed if using httpsCallable

const noteApp = combineReducers({
  notes,
  auth,
  user,
  settings,
});
export type RootState = ReturnType<typeof noteApp>;

export default function configureStore(persistedState?: RootState) {
  const store = createStore(noteApp, persistedState, applyMiddleware(thunk));
  (store.dispatch as ThunkDispatch<RootState, void, AnyAction>)(verifyAuth());
  return store;
}
