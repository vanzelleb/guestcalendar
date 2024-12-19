import { generateDates, formatDateStr, isWeekend } from '../utils/dateUtils.js';
import { getBookings, bookDate, cancelBooking } from '../services/bookingService.js';
import { getCurrentUser } from '../store/userStore.js';

export async function renderCalendar() {
    const currentUser = getCurrentUser();
    const calendarDiv = document.getElementById('calendar');
    const dates = generateDates();
    const bookings = await getBookings();

    // Clear calendar
    calendarDiv.innerHTML = '<h2></h2>';

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

    // Create wrapper for date and booking info
    const dayInfo = document.createElement('div');
    dayInfo.className = 'calendar-day-info';

    const dateSpan = document.createElement('span');
    dateSpan.className = 'date-text';
    dateSpan.textContent = date.toDateString();
    dayInfo.appendChild(dateSpan);

    dayDiv.appendChild(dayInfo);

    if (booking) {
        appendBookingInfo(dayInfo, booking, isOwner, isAdmin, dateStr, dayDiv);
    } else if (currentUser) {
        appendBookButton(dayDiv, dateStr, currentUser);
    }

    return dayDiv;
}

function appendBookingInfo(dayInfo, booking, isOwner, isAdmin, dateStr, dayDiv) {
    const bookedSpan = document.createElement('span');
    bookedSpan.className = 'booked-info';
    const displayName = isOwner || isAdmin ?
        (booking.userName) : 'someone';
    bookedSpan.textContent = `Reserved by ${displayName}`;
    dayInfo.appendChild(bookedSpan);

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
        dayDiv.appendChild(cancelBtn);  // Add to dayDiv, not dayInfo
    }
}

function appendBookButton(dayDiv, dateStr, currentUser) {
    const bookBtn = document.createElement('button');
    bookBtn.className = 'book';
    bookBtn.textContent = "I'm coming";
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