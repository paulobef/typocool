import {firebaseApp, RootState} from "../index";
import {
    loginError,
    logoutError,
    receiveLogin,
    receiveLogout,
    requestLogin,
    requestLogout,
    verifyRequest, verifySuccess
} from "./actions";
import { AnyAction, } from "redux";
import {ThunkAction, } from "redux-thunk";

export type AppThunkAction = ThunkAction<void, RootState, unknown, AnyAction>;

export const loginUser = (email: string, password: string): AppThunkAction => async dispatch => {
    dispatch(requestLogin());
    const auth = firebaseApp.auth()
    try {
        const user = await auth.signInWithEmailAndPassword(email, password)
        dispatch(receiveLogin(user as any));
    }
    catch(error) {
        console.log(error);
        //Do something with the error if you want!
        dispatch(loginError()); // TODO: handle error with loginError()
    }
};


export const logoutUser = (): AppThunkAction => dispatch => {
    dispatch(requestLogout());
    firebaseApp
        .auth()
        .signOut()
        .then(() => {
            dispatch(receiveLogout());
        })
        .catch(error => {
            //Do something with the error if you want!
            dispatch(logoutError());
        });
};

export const verifyAuth = (): AppThunkAction => dispatch => {
    dispatch(verifyRequest());
    firebaseApp
        .auth()
        .onAuthStateChanged(user => {
            if (user !== null) {
                dispatch(receiveLogin(user));
            }
            dispatch(verifySuccess());
        });
};
