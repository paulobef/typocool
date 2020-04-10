import {
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT_REQUEST,
    LOGOUT_SUCCESS,
    LOGOUT_FAILURE,
    VERIFY_REQUEST,
    VERIFY_SUCCESS, AuthActionsType, AuthState
} from './types'
import {User} from "firebase";


function requestLogin(state: AuthState): AuthState {
    return Object.freeze(Object.assign({}, state, {
        isLoggingIn: true,
        loginError: false
    }))
}

function loginSuccess(state: AuthState, payload: User): AuthState {
    return Object.freeze(Object.assign({}, state, {
        isLoggingIn: false,
        isAuthenticated: true,
        user: payload
    }))
}

function loginError(state: AuthState): AuthState {
    return Object.freeze(Object.assign({}, state, {
        isLoggingIn: false,
        isAuthenticated: false,
        loginError: true
    }))
}

function logoutRequest(state: AuthState): AuthState {
    return Object.freeze(Object.assign({}, state, {
        isLoggingOut: true,
        logoutError: false
    }))
}

function logoutSuccess(state: AuthState): AuthState {
    return Object.freeze(Object.assign({}, state, {
        isLoggingOut: false,
        isAuthenticated: false,
        logoutError: false
    }))
}

function logoutError(state: AuthState): AuthState {
    return Object.freeze(Object.assign({}, state, {
        isLoggingOut: false,
        logoutError: true
    }))
}

function verifyRequest(state: AuthState): AuthState {
    return Object.freeze(Object.assign({}, state, {
        isVerifying: true,
        verifyingError: false
    }))
}

function verifySuccess(state: AuthState): AuthState {
    return Object.freeze(Object.assign({}, state, {
        isVerifying: false
    }))
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
}

export default function auth(state = initialState, action: AuthActionsType) {
    switch (action.type) {
        case LOGIN_REQUEST: return requestLogin(state);
        case LOGIN_SUCCESS: return loginSuccess(state, action.payload);
        case LOGIN_FAILURE: return loginError(state)
        case LOGOUT_REQUEST: return logoutRequest(state)
        case LOGOUT_SUCCESS: return logoutSuccess(state)
        case LOGOUT_FAILURE: return logoutError(state)
        case VERIFY_REQUEST: return verifyRequest(state)
        case VERIFY_SUCCESS: return verifySuccess(state)
        default:
            return state;
    }
};
