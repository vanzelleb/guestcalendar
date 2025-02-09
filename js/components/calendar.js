import { generateDates, formatDateStr, isWeekend } from '../utils/dateUtils.js';
import { getBookings, bookDate, cancelBooking } from '../services/bookingService.js';
import { getCurrentUser } from '../store/userStore.js';

export async function renderCalendar() {
    const currentUser = getCurrentUser();
    const calendarDiv = document.getElementById('calendar');
    const dates = generateDates();
    const bookings = await getBookings();

    // Clear calendar
    calendarDiv.innerHTML = '';

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
    dayDiv.className = 'calendar-day' + (isWeekend(date) ? ' weekend' : '');
    dayDiv.innerHTML = `
        <div class="calendar-day-info">
            <span class="date-text">${date.toDateString()}</span>
            ${booking ? `<span class="booked-info">Reserved by ${(isOwner || isAdmin) ? booking.userName : 'someone'}</span>` : ''}
        </div>
    `;

    if (booking && (isOwner || isAdmin)) {
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
    } else if (!booking && currentUser) {
        const bookBtn = document.createElement('button');
        bookBtn.className = 'book';
        bookBtn.textContent = "I'm coming";
        bookBtn.onclick = async () => {
            try {
                bookBtn.disabled = true;
                await bookDate(dateStr, currentUser);
                renderCalendar();
            } catch (error) {
                bookBtn.disabled = false;
                alert('Error booking date: ' + error.message);
            }
        };
        dayDiv.appendChild(bookBtn);
    }
    return dayDiv;
}