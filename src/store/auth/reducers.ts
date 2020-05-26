import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,
    VERIFY_REQUEST,
    VERIFY_SUCCESS,
    AuthActionTypes, AuthState, VERIFY_ERROR
} from './types'
import {User} from "firebase";
import {assfreeze} from "../../utils/assfreeze";

function requestLogin(state: AuthState): AuthState {
    return assfreeze(state, {
        isLoggingIn: true,
        loginError: false
    }) as AuthState
}

function loginSuccess(state: AuthState, payload: User): AuthState {
    return assfreeze(state, {
        isLoggingIn: false,
        isAuthenticated: true,
        user: payload
    }) as AuthState
}

function loginError(state: AuthState): AuthState {
    return assfreeze(state, {
        isLoggingIn: false,
        isAuthenticated: false,
        loginError: true
    }) as AuthState
}

function logoutRequest(state: AuthState): AuthState {
    return assfreeze(state, {
        isLoggingOut: true,
        logoutError: false
    }) as AuthState
}

function logoutSuccess(state: AuthState): AuthState {
    return assfreeze(state, {
        isLoggingOut: false,
        isAuthenticated: false,
        logoutError: false
    }) as AuthState
}

function logoutError(state: AuthState): AuthState {
    return assfreeze(state, {
        isLoggingOut: false,
        logoutError: true
    }) as AuthState
}

function verifyRequest(state: AuthState): AuthState {
    return assfreeze(state, {
        isVerifying: true,
        verifyingError: false
    }) as AuthState
}

function verifySuccess(state: AuthState): AuthState {
    return assfreeze(state, {
        isVerifying: false,
        verifyingError: false
    }) as AuthState
}

function verifyError(state: AuthState): AuthState {
    return assfreeze(state, {
        isVerifying: false,
        verifyingError: true
    }) as AuthState
}


const initialState: AuthState = {
    isLoggingIn: false,
    isLoggingOut: false,
    isVerifying: false,
    verifyingError: false,
    loginError: false,
    logoutError: false,
    isAuthenticated: false,
    user: Object.create(null)
};

export default function auth(state = initialState, action: AuthActionTypes) {
    switch (action.type) {
        case LOGIN_REQUEST: return requestLogin(state);
        case LOGIN_SUCCESS: return loginSuccess(state, action.payload);
        case LOGIN_FAILURE: return loginError(state)
        case LOGOUT_REQUEST: return logoutRequest(state)
        case LOGOUT_SUCCESS: return logoutSuccess(state)
        case LOGOUT_FAILURE: return logoutError(state)
        case VERIFY_REQUEST: return verifyRequest(state)
        case VERIFY_SUCCESS: return verifySuccess(state)
        case VERIFY_ERROR: return verifyError(state)
        default:
            return state;
    }
};
