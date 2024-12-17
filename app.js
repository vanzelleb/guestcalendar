const firebaseConfig = {
    apiKey: "AIzaSyD1DL0W7gZvjwRp6EBBp25Kr0qFFH0z3SI",
    authDomain: "guest-calendar-d4a1d.firebaseapp.com",
    projectId: "guest-calendar-d4a1d",
    storageBucket: "guest-calendar-d4a1d.firebasestorage.app",
    messagingSenderId: "23668340445",
    appId: "1:23668340445:web:c58ea8bfe3d171af694d34"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

let currentUser = null;

// Auth state observer
auth.onAuthStateChanged((user) => {
    currentUser = user;
    const userInfo = document.getElementById('userInfo');
    const loginForm = document.getElementById('loginForm');
    const userEmail = document.getElementById('userEmail');

    if (user) {
        userInfo.style.display = 'block';
        loginForm.style.display = 'none';
        userEmail.textContent = user.email;
    } else {
        userInfo.style.display = 'none';
        loginForm.style.display = 'block';
    }
    renderCalendar();
});

// Authentication handler
async function handleAuth() {
    const email = document.getElementById('email').value;
    let name = document.getElementById('name').value;
    
    // Add padding to meet Firebase password requirements
    const paddedName = name + '123!@#FirebaseMin';
    
    try {
        // Try to sign in first
        await auth.signInWithEmailAndPassword(email, paddedName);
    } catch (error) {
        // If sign in fails, create new account
        try {
            await auth.createUserWithEmailAndPassword(email, paddedName);
        } catch (error) {
            alert('Authentication error: ' + error.message);
        }
    }
}

// Sign out handler
function handleSignOut() {
    auth.signOut();
}

// Generate dates for the next year
function generateDates() {
    const dates = [];
    const today = new Date();
    const oneYear = new Date();
    oneYear.setFullYear(today.getFullYear() + 1);

    for (let d = new Date(today); d <= oneYear; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d));
    }
    return dates;
}

// Book a date
async function bookDate(dateStr) {
    if (!currentUser) {
        alert('Please sign in to book dates');
        return;
    }

    try {
        await db.collection('bookings').doc(dateStr).set({
            userId: currentUser.uid,
            userEmail: currentUser.email,
            date: dateStr
        });
        renderCalendar();
    } catch (error) {
        alert('Error booking date: ' + error.message);
    }
}

// Cancel a booking
async function cancelBooking(dateStr) {
    try {
        await db.collection('bookings').doc(dateStr).delete();
        renderCalendar();
    } catch (error) {
        alert('Error canceling booking: ' + error.message);
    }
}

// Render calendar
async function renderCalendar() {
    const calendarDiv = document.getElementById('calendar');
    const dates = generateDates();
    
    // Get all bookings
    const bookingsSnapshot = await db.collection('bookings').get();
    const bookings = {};
    bookingsSnapshot.forEach(doc => {
        bookings[doc.id] = doc.data();
    });

    // Clear calendar
    calendarDiv.innerHTML = '<h2>Available Dates</h2>';

    // Create calendar entries
    dates.forEach(date => {
        const dateStr = date.toISOString().split('T')[0];
        const booking = bookings[dateStr];
        const isAdmin = currentUser && currentUser.email === 'admin@example.com';
        const isOwner = booking && currentUser && booking.userId === currentUser.uid;

        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        
        const dateSpan = document.createElement('span');
        dateSpan.textContent = date.toDateString();
        dayDiv.appendChild(dateSpan);

        if (booking) {
            const bookedSpan = document.createElement('span');
            bookedSpan.className = 'booked-info';
            bookedSpan.textContent = `Booked by ${isOwner || isAdmin ? booking.userEmail : 'someone'}`;
            dayDiv.appendChild(bookedSpan);

            if (isOwner || isAdmin) {
                const cancelBtn = document.createElement('button');
                cancelBtn.className = 'cancel';
                cancelBtn.textContent = 'Cancel';
                cancelBtn.onclick = () => cancelBooking(dateStr);
                dayDiv.appendChild(cancelBtn);
            }
        } else if (currentUser) {
            const bookBtn = document.createElement('button');
            bookBtn.textContent = 'Book';
            bookBtn.onclick = () => bookDate(dateStr);
            dayDiv.appendChild(bookBtn);
        }

        calendarDiv.appendChild(dayDiv);
    });
}