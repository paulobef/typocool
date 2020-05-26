import {
    AuthActionTypes,
    LOGIN_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGOUT_FAILURE, LOGOUT_REQUEST,
    LOGOUT_SUCCESS, VERIFY_ERROR,
    VERIFY_REQUEST, VERIFY_SUCCESS
} from "./types";
import {User} from "firebase";


export const requestLogin = (): AuthActionTypes => {
    return {
        type: LOGIN_REQUEST
    };
};

export const receiveLogin = (payload: User): AuthActionTypes => {
    return {
        type: LOGIN_SUCCESS,
        payload
    };
};

export const loginError = (): AuthActionTypes => {
    return {
        type: LOGIN_FAILURE
    };
};

export const requestLogout = (): AuthActionTypes => {
    return {
        type: LOGOUT_REQUEST
    };
};

export const receiveLogout = (): AuthActionTypes => {
    return {
        type: LOGOUT_SUCCESS,
    };
};

export const logoutError = (): AuthActionTypes => {
    return {
        type: LOGOUT_FAILURE
    };
};

export const verifyRequest = (): AuthActionTypes => {
    return {
        type: VERIFY_REQUEST
    }
};

export const verifySuccess = (): AuthActionTypes => {
    return {
        type: VERIFY_SUCCESS
    }
};

export const verifyError = (): AuthActionTypes => {
    return {
        type: VERIFY_ERROR
    }
};
