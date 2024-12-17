import { auth, db } from '../config/firebase.js';

export async function signInOrSignUp(email, name) {
    const paddedName = name + '123!@#FirebaseMin';
    
    try {
        // Try to sign in first
        const userCredential = await auth.signInWithEmailAndPassword(email, paddedName);
        // Update user profile in Firestore
        await db.collection('users').doc(userCredential.user.uid).set({
            email: email,
            name: name
        }, { merge: true });
    } catch (error) {
        // If sign in fails, create new account
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, paddedName);
            // Create user profile in Firestore
            await db.collection('users').doc(userCredential.user.uid).set({
                email: email,
                name: name
            });
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