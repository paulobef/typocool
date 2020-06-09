import { fireauth } from "../index";
import {
  loginError,
  logoutError,
  receiveLogin,
  receiveLogout,
  requestLogin,
  requestLogout,
  verifyError,
  verifyRequest,
  verifySuccess,
} from "./actions";
import { AppThunkAction } from "../types";
import { receiveUserData } from "../user/actions";
import { getUserFromFirestore } from "../utils";
import { fetchNotes } from "../notes/thunks";
import { listenToSettingsUpdates } from "../settings/thunks";

export const loginUser = (
  email: string,
  password: string
): AppThunkAction => async (dispatch) => {
  dispatch(requestLogin());
  try {
    const { user } = await fireauth.signInWithEmailAndPassword(email, password);
    if (user !== null) {
      dispatch(receiveLogin(user));
      const dbUser = await getUserFromFirestore(user.uid);
      dispatch(receiveUserData(dbUser));
    } else {
      dispatch(loginError());
    }
  } catch (error) {
    console.log(error);
    //Do something with the error if you want!
    dispatch(loginError()); // TODO: handle error with loginError()
  }
};

export const logoutUser = (): AppThunkAction => (dispatch) => {
  dispatch(requestLogout());
  fireauth
    .signOut()
    .then(() => {
      dispatch(receiveLogout());
    })
    .catch((error) => {
      console.log(error);
      //Do something with the error if you want!
      dispatch(logoutError());
    });
};

export const verifyAuth = (): AppThunkAction => async (dispatch) => {
  dispatch(verifyRequest());
  try {
    fireauth.onAuthStateChanged(async (user) => {
      if (user !== null) {
        dispatch(receiveLogin(user));
        const dbUser = await getUserFromFirestore(user.uid);
        dispatch(receiveUserData(dbUser));
        dispatch(fetchNotes());
        dispatch(listenToSettingsUpdates());
        dispatch(verifySuccess());
      }
      dispatch(verifyError());
    });
  } catch (error) {
    dispatch(verifyError());
    console.log(error);
  }
};
