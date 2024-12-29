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

    const bookingData = {
        userId: user.uid,
        userEmail: user.email,
        userName: userName,
        date: dateStr
    };

    await db.collection('bookings').doc(dateStr).set(bookingData);
    return bookingData;  // Return the booking data
}

export async function cancelBooking(dateStr) {
    return db.collection('bookings').doc(dateStr).delete();
}