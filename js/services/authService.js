import { auth, db } from '../config/firebase.js';

export async function signInOrSignUp(email, name) {
    const paddedName = name + '123!@#FirebaseMin';
    let userCredential;
    try {
        userCredential = await auth.signInWithEmailAndPassword(email, paddedName);
    } catch (error) {
        userCredential = await auth.createUserWithEmailAndPassword(email, paddedName);
    }
    await db.collection('users').doc(userCredential.user.uid).set({
        email,
        name
    }, { merge: true });
}

export function signOut() {
    return auth.signOut();
}

export function onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
}