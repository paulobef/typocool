import {User} from "firebase";

export const LOGIN_REQUEST = "app/auth/login/request";
export const LOGIN_SUCCESS = "app/auth/login/success";
export const LOGIN_FAILURE = "app/auth/login/failure";
export const LOGOUT_REQUEST = "app/auth/logout/request";
export const LOGOUT_SUCCESS = "app/auth/logout/success";
export const LOGOUT_FAILURE = "app/auth/logout/failure";
export const VERIFY_REQUEST = "app/auth/verify/request";
export const VERIFY_SUCCESS = "app/auth/verify/success";


export interface AuthState {
    isLoggingIn: boolean
    isLoggingOut: boolean
    isVerifying: boolean
    loginError: boolean
    logoutError: boolean
    verifyingError: boolean
    isAuthenticated: boolean
    user: User
}

// ACTION TYPES
interface requestLogin {
    type: typeof LOGIN_REQUEST
}

interface loginSuccess {
    type: typeof LOGIN_SUCCESS
    payload: User
}

interface loginError {
    type: typeof LOGIN_FAILURE
}

interface requestLogout {
    type: typeof LOGOUT_REQUEST
}

interface logoutSuccess {
    type: typeof LOGOUT_SUCCESS
}

interface logoutError {
    type: typeof LOGOUT_FAILURE
}

interface verifyRequest {
    type: typeof VERIFY_REQUEST
}

interface verifySuccess {
    type: typeof VERIFY_SUCCESS
}

export type AuthActionsType =  requestLogin | requestLogout | verifySuccess | verifyRequest | logoutError | logoutSuccess | loginSuccess | loginError
