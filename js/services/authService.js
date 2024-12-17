import { auth } from '../config/firebase.js';

export async function signInOrSignUp(email, name) {
    const paddedName = name + '123!@#FirebaseMin';
    
    try {
        // Try to sign in first
        await auth.signInWithEmailAndPassword(email, paddedName);
    } catch (error) {
        // If sign in fails, create new account
        try {
            await auth.createUserWithEmailAndPassword(email, paddedName);
        } catch (error) {
            throw new Error('Authentication error: ' + error.message);
        }
    }
}

export function signOut() {
    return auth.signOut();
}

export function onAuthStateChanged(callback) {
    return auth.onAuthStateChanged(callback);
}