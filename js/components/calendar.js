import { generateDates, formatDateStr, isWeekend, extractNameFromEmail } from '../utils/dateUtils.js';
import { getBookings, bookDate, cancelBooking } from '../services/bookingService.js';
import { getCurrentUser } from '../store/userStore.js';

export async function renderCalendar() {
    const currentUser = getCurrentUser();
    const calendarDiv = document.getElementById('calendar');
    const dates = generateDates();
    const bookings = await getBookings();

    // Clear calendar
    calendarDiv.innerHTML = '<h2>Available Dates</h2>';

    // Create calendar entries
    dates.forEach(date => {
        const dateStr = formatDateStr(date);
        const booking = bookings[dateStr];
        const isAdmin = currentUser && currentUser.email === 'wannikid@gmail.com';
        const isOwner = booking && currentUser && booking.userId === currentUser.uid;

        const dayDiv = createDayElement(date, booking, currentUser, isOwner, isAdmin, dateStr);
        calendarDiv.appendChild(dayDiv);
    });
}

function createDayElement(date, booking, currentUser, isOwner, isAdmin, dateStr) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'calendar-day';
    if (isWeekend(date)) {
        dayDiv.classList.add('weekend');
    }
    
    const dateSpan = document.createElement('span');
    dateSpan.className = 'date-text';
    dateSpan.textContent = date.toDateString();
    dayDiv.appendChild(dateSpan);

    if (booking) {
        appendBookingInfo(dayDiv, booking, isOwner, isAdmin, dateStr);
    } else if (currentUser) {
        appendBookButton(dayDiv, dateStr, currentUser);
    }

    return dayDiv;
}

function appendBookingInfo(dayDiv, booking, isOwner, isAdmin, dateStr) {
    const bookedSpan = document.createElement('span');
    bookedSpan.className = 'booked-info';
    const displayName = isOwner || isAdmin ? extractNameFromEmail(booking.userEmail) : 'someone';
    bookedSpan.textContent = `Booked by ${displayName}`;
    dayDiv.appendChild(bookedSpan);

    if (isOwner || isAdmin) {
        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'cancel';
        cancelBtn.textContent = 'Cancel';
        cancelBtn.onclick = async () => {
            try {
                await cancelBooking(dateStr);
                renderCalendar();
            } catch (error) {
                alert('Error canceling booking: ' + error.message);
            }
        };
        dayDiv.appendChild(cancelBtn);
    }
}

function appendBookButton(dayDiv, dateStr, currentUser) {
    const bookBtn = document.createElement('button');
    bookBtn.textContent = 'Book';
    bookBtn.onclick = async () => {
        try {
            await bookDate(dateStr, currentUser);
            renderCalendar();
        } catch (error) {
            alert('Error booking date: ' + error.message);
        }
    };
    dayDiv.appendChild(bookBtn);
}