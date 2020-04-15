import {fireauth, firestore} from "../index";
import {AppThunkAction} from "../types";
import {receiveLogin} from "../auth/actions";
import {receiveUserData} from "./actions";
import {getUserFromFirestore} from "../utils";




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
        // We don't use withConverter.toFirestore method when creating/setting data
        // because we want firebase to use the uid as document id and therefore don't pass the id to set() or add()
        // which expect a complete User class and thus throw type error
        const { user } = await fireauth.createUserWithEmailAndPassword(email, password)
        if (user !== null) {
            firestore.collection('users').doc(user.uid).set({
                email,
                firstName,
                lastName
            });
        }
    } catch(error) {
        console.log(error);
    }
};

