import { onAuthStateChanged } from './services/authService.js';
import { initializeAuthUI, handleAuth, handleSignOut } from './components/auth.js';
import { renderCalendar } from './components/calendar.js';
import { setCurrentUser } from './store/userStore.js';
import { SELECTORS } from './config/constants.js';

// Initialize auth UI when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const authUI = initializeAuthUI();
    const loginForm = document.querySelector(SELECTORS.LOGIN_FORM);
    const signOutBtn = document.querySelector('.auth-form-button');

    // Attach event listeners
    loginForm.addEventListener('submit', handleAuth);
    signOutBtn.addEventListener('click', handleSignOut);

    // Auth state observer
    onAuthStateChanged((user) => {
        setCurrentUser(user);
        if (user) {
            authUI.showLoggedIn(user);
        } else {
            authUI.showLoggedOut();
        }
        renderCalendar();
    });
});