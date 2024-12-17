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

    return db.collection('bookings').doc(dateStr).set({
        userId: user.uid,
        userEmail: user.email,
        date: dateStr
    });
}

export async function cancelBooking(dateStr) {
    return db.collection('bookings').doc(dateStr).delete();
}