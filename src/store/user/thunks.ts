import {fireauth, firestore} from "../index";
import {AppThunkAction} from "../types";
import {receiveLogin} from "../auth/actions";
import {receiveUserData} from "./actions";
import {getUserFromFirestore} from "../utils";
import dayjs from "dayjs";




export const createUser = (firstName: string, lastName: string, email: string, password: string): AppThunkAction => async dispatch => {
    fireauth.onAuthStateChanged(async user => {
        if (user !== null) {
            try {
                dispatch(receiveLogin(user));
                const dbUser = await getUserFromFirestore(user.uid);
                dispatch(receiveUserData(dbUser));
            } catch (error) {
                console.log(error);
            }
        }});
    try {

        const { user } = await fireauth.createUserWithEmailAndPassword(email, password)
        if (user !== null) {
            firestore.collection('users').doc(user.uid).set({
                email,
                firstName,
                lastName
            });
            firestore.collection('settings').doc(user.uid).set({
                fontSize: 12,
                lastSaved: dayjs().toISOString()
            });
        }
    } catch(error) {
        console.log(error);
    }
};

