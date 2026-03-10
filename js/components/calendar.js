import { generateDates, formatDateStr, isWeekend } from '../utils/dateUtils.js';
import { getBookings, bookDate, cancelBooking } from '../services/bookingService.js';
import { getCurrentUser } from '../store/userStore.js';
import { ADMIN_EMAIL, SELECTORS, BUTTON_CLASSES, BUTTON_TEXT, DOM_CLASSES, COLLECTIONS } from '../config/constants.js';

let currentBookings = {};

export async function renderCalendar() {
    const currentUser = getCurrentUser();
    const calendarDiv = document.querySelector(SELECTORS.CALENDAR);
    const dates = generateDates();
    currentBookings = await getBookings();

    // Clear calendar
    calendarDiv.innerHTML = '';

    // Create calendar entries
    dates.forEach(date => {
        const dateStr = formatDateStr(date);
        const booking = currentBookings[dateStr];
        const isAdmin = isUserAdmin(currentUser);
        const isOwner = booking && currentUser && booking.userId === currentUser.uid;

        const dayDiv = createDayElement(date, booking, currentUser, isOwner, isAdmin, dateStr);
        calendarDiv.appendChild(dayDiv);
    });

    attachCalendarEventListeners(calendarDiv);
}

function isUserAdmin(user) {
    return user && user.email === ADMIN_EMAIL;
}

function createDayElement(date, booking, currentUser, isOwner, isAdmin, dateStr) {
    const dayDiv = document.createElement('div');
    dayDiv.className = DOM_CLASSES.CALENDAR_DAY + (isWeekend(date) ? ' ' + DOM_CLASSES.WEEKEND : '');
    dayDiv.dataset.date = dateStr;

    const infoDiv = document.createElement('div');
    infoDiv.className = 'calendar-day-info';

    const dateText = document.createElement('span');
    dateText.className = 'date-text';
    dateText.textContent = date.toDateString();
    infoDiv.appendChild(dateText);

    if (booking) {
        const bookedInfo = document.createElement('span');
        bookedInfo.className = DOM_CLASSES.BOOKED_INFO;
        bookedInfo.textContent = `Reserved by ${(isOwner || isAdmin) ? booking.userName : 'someone'}`;
        infoDiv.appendChild(bookedInfo);
    }

    dayDiv.appendChild(infoDiv);

    if (booking && (isOwner || isAdmin)) {
        const cancelBtn = document.createElement('button');
        cancelBtn.className = BUTTON_CLASSES.CANCEL;
        cancelBtn.textContent = BUTTON_TEXT.CANCEL;
        cancelBtn.dataset.action = 'cancel';
        cancelBtn.dataset.date = dateStr;
        dayDiv.appendChild(cancelBtn);
    } else if (!booking && currentUser) {
        const bookBtn = document.createElement('button');
        bookBtn.className = BUTTON_CLASSES.BOOK;
        bookBtn.textContent = BUTTON_TEXT.BOOK;
        bookBtn.dataset.action = 'book';
        bookBtn.dataset.date = dateStr;
        dayDiv.appendChild(bookBtn);
    }

    return dayDiv;
}

function attachCalendarEventListeners(calendarDiv) {
    // Remove existing listener to avoid duplicates
    const newCalendarDiv = calendarDiv.cloneNode(true);
    calendarDiv.parentNode.replaceChild(newCalendarDiv, calendarDiv);

    newCalendarDiv.addEventListener('click', handleCalendarClick);
}

async function handleCalendarClick(event) {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const action = button.dataset.action;
    const dateStr = button.dataset.date;
    const currentUser = getCurrentUser();

    if (action === 'book') {
        try {
            button.disabled = true;
            await bookDate(dateStr, currentUser);
            currentBookings[dateStr] = {
                userId: currentUser.uid,
                userName: currentUser.displayName || 'Guest',
                userEmail: currentUser.email
            };
            updateDayElement(dateStr, true, currentUser);
        } catch (error) {
            button.disabled = false;
            alert('Error booking date: ' + error.message);
        }
    } else if (action === 'cancel') {
        try {
            await cancelBooking(dateStr);
            delete currentBookings[dateStr];
            updateDayElement(dateStr, false, currentUser);
        } catch (error) {
            alert('Error canceling booking: ' + error.message);
        }
    }
}

function updateDayElement(dateStr, isBooked, currentUser) {
    const dayElement = document.querySelector(`[data-date="${dateStr}"]`);
    if (!dayElement) return;

    const infoDiv = dayElement.querySelector('.calendar-day-info');
    const existingBtn = dayElement.querySelector('button');

    // Remove existing button
    if (existingBtn) existingBtn.remove();

    // Remove existing booked info
    const existingBooked = infoDiv.querySelector('.' + DOM_CLASSES.BOOKED_INFO);
    if (existingBooked) existingBooked.remove();

    if (isBooked) {
        const booking = currentBookings[dateStr];
        const bookedInfo = document.createElement('span');
        bookedInfo.className = DOM_CLASSES.BOOKED_INFO;
        bookedInfo.textContent = `Reserved by ${booking.userName}`;
        infoDiv.appendChild(bookedInfo);

        const cancelBtn = document.createElement('button');
        cancelBtn.className = BUTTON_CLASSES.CANCEL;
        cancelBtn.textContent = BUTTON_TEXT.CANCEL;
        cancelBtn.dataset.action = 'cancel';
        cancelBtn.dataset.date = dateStr;
        dayElement.appendChild(cancelBtn);
    } else if (currentUser) {
        const bookBtn = document.createElement('button');
        bookBtn.className = BUTTON_CLASSES.BOOK;
        bookBtn.textContent = BUTTON_TEXT.BOOK;
        bookBtn.dataset.action = 'book';
        bookBtn.dataset.date = dateStr;
        dayElement.appendChild(bookBtn);
    }
}