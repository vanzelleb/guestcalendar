import { db } from '../config/firebase.js';
import { COLLECTIONS } from '../config/constants.js';

export async function getBookings() {
    const bookingsSnapshot = await db.collection(COLLECTIONS.BOOKINGS).get();
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
    const userDoc = await db.collection(COLLECTIONS.USERS).doc(user.uid).get();
    const userData = userDoc.data();
    const userName = userData?.name;

    const bookingData = {
        userId: user.uid,
        userEmail: user.email,
        userName: userName,
        date: dateStr
    };

    await db.collection(COLLECTIONS.BOOKINGS).doc(dateStr).set(bookingData);
    return bookingData;
}

export async function cancelBooking(dateStr) {
    return db.collection(COLLECTIONS.BOOKINGS).doc(dateStr).delete();
}