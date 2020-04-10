import {
    AuthActionsType,
    LOGIN_FAILURE,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGOUT_FAILURE, LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    VERIFY_REQUEST, VERIFY_SUCCESS
} from "./types";
import {User} from "firebase";


export const requestLogin = (): AuthActionsType => {
    return {
        type: LOGIN_REQUEST
    };
};

export const receiveLogin = (payload: User): AuthActionsType => {
    return {
        type: LOGIN_SUCCESS,
        payload
    };
};

export const loginError = (): AuthActionsType => {
    return {
        type: LOGIN_FAILURE
    };
};

export const requestLogout = (): AuthActionsType => {
    return {
        type: LOGOUT_REQUEST
    };
};

export const receiveLogout = (): AuthActionsType => {
    return {
        type: LOGOUT_SUCCESS,
    };
};

export const logoutError = (): AuthActionsType => {
    return {
        type: LOGOUT_FAILURE
    };
};

export const verifyRequest = (): AuthActionsType => {
    return {
        type: VERIFY_REQUEST
    }
};

export const verifySuccess = (): AuthActionsType => {
    return {
        type: VERIFY_SUCCESS
    }
};
