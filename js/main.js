import { onAuthStateChanged } from './services/authService.js';
import { initializeAuthUI, handleAuth, handleSignOut } from './components/auth.js';
import { renderCalendar } from './components/calendar.js';
import { setCurrentUser } from './store/userStore.js';

// Make auth functions globally available
window.handleAuth = handleAuth;
window.handleSignOut = handleSignOut;

// Initialize auth UI when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const authUI = initializeAuthUI();

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