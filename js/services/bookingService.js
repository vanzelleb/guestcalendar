import { db } from '../config/firebase.js';

export async function getBookings() {
    const bookingsSnapshot = await db.collection('bookings').get();
    const bookings = {};
    bookingsSnapshot.forEach(doc => {
        bookings[doc.id] = doc.data();
    });
    return bookings;
}

export async function bookDate(dateStr, user) {
    if (!user) {
        throw new Error('Please sign in to book dates');
    }

    // Get user profile from Firestore
    const userDoc = await db.collection('users').doc(user.uid).get();
    const userData = userDoc.data();
    const userName = userData?.name;

    return db.collection('bookings').doc(dateStr).set({
        userId: user.uid,
        userEmail: user.email,
        userName: userName,
        date: dateStr
    });
}

export async function cancelBooking(dateStr) {
    return db.collection('bookings').doc(dateStr).delete();
}